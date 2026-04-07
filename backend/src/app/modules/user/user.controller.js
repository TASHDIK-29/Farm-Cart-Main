import { User } from './user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
  try {
    const { name, email, password, role, businessName, description, location, profileImage } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    console.log(existingUser);

    const userData = {
      name, email, password, role,
      ...(role === 'farmer' && { businessName, description, location, profileImage })
    };

    const user = await User.create(userData);
    res.status(201).json({ success: true, message: 'User registered successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

    res.status(200).json({ success: true, message: 'Login successful', token, role: user.role, userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFarmers = async (req, res) => {
  try {
    // Return exclusively farmers sorted descending by their average rating
    const farmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort({ averageRating: -1 });

    res.status(200).json({ success: true, data: farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = await User.findById(farmerId).select('-password');
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }
    res.status(200).json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const UserController = { register, login, getAllFarmers, getFarmerById };
