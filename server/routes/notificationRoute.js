const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const router = express.Router();

router.get('/notifications', authenticateToken, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: 'Notification marked as read' });
});

module.exports = router;
