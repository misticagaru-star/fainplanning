const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// Get all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().populate('department').sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get workers by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const workers = await Worker.find({ department: req.params.departmentId })
      .populate('department')
      .sort({ name: 1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('department');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create worker
router.post('/', async (req, res) => {
  const worker = new Worker({
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    position: req.body.position,
    maxHoursPerDay: req.body.maxHoursPerDay
  });

  try {
    const newWorker = await worker.save();
    await newWorker.populate('department');
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update worker
router.patch('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    if (req.body.name) worker.name = req.body.name;
    if (req.body.email) worker.email = req.body.email;
    if (req.body.department) worker.department = req.body.department;
    if (req.body.position) worker.position = req.body.position;
    if (req.body.maxHoursPerDay) worker.maxHoursPerDay = req.body.maxHoursPerDay;
    if (req.body.isActive !== undefined) worker.isActive = req.body.isActive;
    worker.updatedAt = Date.now();

    const updatedWorker = await worker.save();
    await updatedWorker.populate('department');
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete worker
router.delete('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    
    await Worker.deleteOne({ _id: req.params.id });
    res.json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
