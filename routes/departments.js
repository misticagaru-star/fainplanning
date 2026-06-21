const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single department
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create department
router.post('/', async (req, res) => {
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color
  });

  try {
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update department
router.patch('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    if (req.body.name) department.name = req.body.name;
    if (req.body.description) department.description = req.body.description;
    if (req.body.color) department.color = req.body.color;
    department.updatedAt = Date.now();

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    
    await Department.deleteOne({ _id: req.params.id });
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
