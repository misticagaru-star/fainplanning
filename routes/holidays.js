const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday');

// Get all holidays
router.get('/', async (req, res) => {
  try {
    const holidays = await Holiday.find()
      .populate('departments')
      .sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get holidays by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    
    const holidays = await Holiday.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('departments')
      .sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single holiday
router.get('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id).populate('departments');
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create holiday
router.post('/', async (req, res) => {
  const holiday = new Holiday({
    name: req.body.name,
    date: new Date(req.body.date),
    type: req.body.type,
    departments: req.body.departments || []
  });

  try {
    const newHoliday = await holiday.save();
    await newHoliday.populate('departments');
    res.status(201).json(newHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update holiday
router.patch('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });

    if (req.body.name) holiday.name = req.body.name;
    if (req.body.date) holiday.date = new Date(req.body.date);
    if (req.body.type) holiday.type = req.body.type;
    if (req.body.departments) holiday.departments = req.body.departments;
    holiday.updatedAt = Date.now();

    const updatedHoliday = await holiday.save();
    await updatedHoliday.populate('departments');
    res.json(updatedHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete holiday
router.delete('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    await Holiday.deleteOne({ _id: req.params.id });
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
