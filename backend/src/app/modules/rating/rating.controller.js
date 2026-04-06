import { Rating } from './rating.model.js';
import { User } from '../user/user.model.js';
import mongoose from 'mongoose';

const submitRating = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId, consumerId, farmerId, score, review } = req.body;

    const existingRating = await Rating.findOne({ orderId });
    if (existingRating) {
      return res.status(400).json({ success: false, message: 'This order has already been rated' });
    }

    const newRating = await Rating.create([{ orderId, consumerId, farmerId, score: Number(score), review }], { session });

    // Calculate new average
    const stats = await Rating.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(String(farmerId)) } },
      { $group: { _id: '$farmerId', avgRating: { $avg: '$score' } } }
    ]).session(session);

    let updatedAverage = score;
    if (stats.length > 0) {
      updatedAverage = stats[0].avgRating.toFixed(1);
    }

    await User.findByIdAndUpdate(farmerId, { averageRating: updatedAverage }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Rating submitted successfully', data: newRating });
  } catch (error) {
    if(session.inTransaction()) await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerRatings = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const ratings = await Rating.find({ farmerId })
      .populate('consumerId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const RatingController = { submitRating, getFarmerRatings };
