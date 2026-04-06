import { Content } from './content.model.js';

const createPost = async (req, res) => {
  try {
    const { farmerId, text, mediaType } = req.body;
    let mediaUrl = null;

    if (req.file) {
      // Assuming 'req.file' contains the uploaded asset from Multer
      // E.g., saved in /uploads directory
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const postData = {
      farmerId,
      text,
      mediaUrl,
      mediaType: req.file && req.file.mimetype.includes('video') ? 'video' : 'image',
    };

    const newPost = await Content.create(postData);
    
    // Optionally populate user data
    await newPost.populate('farmerId', 'name businessName profileImage');

    res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerPosts = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const posts = await Content.find({ farmerId })
      .populate('farmerId', 'name businessName profileImage averageRating')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTimelinePosts = async (req, res) => {
  try {
    // For consumers to view global feed sorted by recent
    const posts = await Content.find()
      .populate('farmerId', 'name businessName profileImage averageRating location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ContentController = { createPost, getFarmerPosts, getAllTimelinePosts };
