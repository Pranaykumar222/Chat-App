import express from 'express';
import Chat from '../models/Chat.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/chats
// @desc    Get all chats for a user
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find all chats that include the current user
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } }
    })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    
    // Populate sender info in latestMessage
    chats = await Promise.all(
      chats.map(async (chat) => {
        if (chat.latestMessage) {
          const populatedChat = await chat.populate('latestMessage.sender', 'name avatar');
          return populatedChat;
        }
        return chat;
      })
    );
    
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chats
// @desc    Create or access a chat
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' });
    }
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      users: { $all: [req.user._id, userId] },
      $expr: { $eq: [{ $size: "$users" }, 2] } // Ensure it's a 1:1 chat (only 2 users)
    })
      .populate('users', '-password')
      .populate('latestMessage');
    
    if (chat) {
      // Chat exists
      if (chat.latestMessage) {
        chat = await chat.populate('latestMessage.sender', 'name avatar');
      }
      return res.json(chat);
    }
    
    // Create new chat
    const newChat = {
      users: [req.user._id, userId]
    };
    
    chat = await Chat.create(newChat);
    chat = await Chat.findById(chat._id).populate('users', '-password');
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chats/:id
// @desc    Get a single chat
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.id)
      .populate('users', '-password')
      .populate('latestMessage');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is part of this chat
    if (!chat.users.some(user => user._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    if (chat.latestMessage) {
      chat = await chat.populate('latestMessage.sender', 'name avatar');
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;