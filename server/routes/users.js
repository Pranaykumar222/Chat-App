import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find all users except current user
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password');
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    
    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;