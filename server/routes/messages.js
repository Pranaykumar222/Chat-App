import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, chatId } = req.body;
    
    if (!content || !chatId) {
      return res.status(400).json({ message: 'Please provide content and chatId' });
    }
    
    // Create new message
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
      readBy: [req.user._id] // Mark as read by sender
    };
    
    let message = await Message.create(newMessage);
    
    // Populate message with sender and chat details
    message = await Message.findById(message._id)
      .populate({
        path: 'sender',
        select: 'name avatar'
      })
      .populate({
        path: 'chat',
        select: 'users',
        populate: {
          path: 'users',
          select: 'name avatar status'
        }
      });
    
    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/:chatId
// @desc    Get all messages for a chat
// @access  Private
router.get('/:chatId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar')
      .populate('readBy', 'name')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/read
// @desc    Mark message as read
// @access  Private
router.put('/read', verifyToken, async (req, res) => {
  try {
    const { messageId } = req.body;
    
    if (!messageId) {
      return res.status(400).json({ message: 'Please provide messageId' });
    }
    
    // Update message readBy array
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    )
    .populate('sender', 'name avatar')
    .populate('readBy', 'name avatar');
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;