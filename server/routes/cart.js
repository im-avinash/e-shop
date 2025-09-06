// routes/cart.js
const express = require('express');
const { CartItem, Item } = require('../models/db.js');
const auth = require('../middleware/auth');
const router = express.Router();

// Get current user's cart
router.get('/', auth, async (req, res) => {
  const items = await CartItem.findAll({ where: { user_id: req.user.id }, include: [Item] });
  res.json(items);
});

// Add or update item in cart { item_id, quantity }
router.post('/', auth, async (req, res) => {
  const { item_id, quantity = 1 } = req.body;
  if (!item_id) return res.status(400).json({ message: 'item_id required' });
  const existing = await CartItem.findOne({ where: { user_id: req.user.id, item_id } });
  if (existing) {
    existing.quantity = quantity;
    await existing.save();
    return res.json(existing);
  }
  const ci = await CartItem.create({ user_id: req.user.id, item_id, quantity });
  res.json(ci);
});

// Remove item
router.delete('/:item_id', auth, async (req, res) => {
  const { item_id } = req.params;
  await CartItem.destroy({ where: { user_id: req.user.id, item_id } });
  res.json({ message: 'Removed' });
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  await CartItem.destroy({ where: { user_id: req.user.id } });
  res.json({ message: 'Cleared' });
});

module.exports = router;
