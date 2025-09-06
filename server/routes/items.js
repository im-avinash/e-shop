// routes/items.js
const express = require('express');
const { Item, Category } = require('../models/db.js');
const auth = require('../middleware/auth');
const router = express.Router();

// Create item (admin style — for assignment this is fine without roles)
router.post('/', auth, async (req, res) => {
  const { title, description, price, image_url, category } = req.body;
  let cat = null;
  if (category) {
    cat = await Category.findOne({ where: { name: category } });
    if (!cat) cat = await Category.create({ name: category });
  }
  const item = await Item.create({ title, description, price, image_url, category_id: cat ? cat.id : null });
  res.json(item);
});

// Read (list) with filters: ?category=&minPrice=&maxPrice=&q=&sort=price_asc|price_desc
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, q, sort, page = 1, limit = 20 } = req.query;
  const where = {};
  if (minPrice) where.price = { ...(where.price || {}), ['>=']: minPrice }; // Sequelize-friendly below
  // We'll use a safer query using Sequelize operators:
  const { Op } = require('sequelize');
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }
  if (q) where.title = { [Op.like]: `%${q}%` };

  const catFilter = category ? { name: category } : undefined;

  const order = [];
  if (sort === 'price_asc') order.push(['price', 'ASC']);
  else if (sort === 'price_desc') order.push(['price', 'DESC']);

  const items = await Item.findAll({
    where,
    include: [{ model: Category, where: catFilter, required: !!catFilter }],
    order,
    offset: (page - 1) * limit,
    limit: parseInt(limit)
  });
  res.json(items);
});

// Read single
router.get('/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id, { include: [Category] });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.update(req.body);
  res.json(item);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
