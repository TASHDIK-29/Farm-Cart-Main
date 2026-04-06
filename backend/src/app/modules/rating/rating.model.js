import { Schema, model } from 'mongoose';

const ratingSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    consumerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String }
  },
  { timestamps: true }
);

export const Rating = model('Rating', ratingSchema);
