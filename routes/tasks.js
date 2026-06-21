const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Worker = require('../models/Worker');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('worker')
      .populate('department')
      .sort({ startDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks by worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const tasks = await Task.find({ worker: req.params.workerId })
      .populate('worker')
      .populate('department')
      .sort({ startDate: 1, order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    worker: req.body.worker,
    department: req.body.department,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    priority: req.body.priority,
    hoursPerDay: req.body.hoursPerDay,
    color: req.body.color,
    order: req.body.order || 0
  });

  try {
    const newTask = await task.save();
    await newTask.populate('worker');
    await newTask.populate('department');
    
    // Auto-reorder tasks for this worker
    await reorderWorkerTasks(req.body.worker);
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldWorkerId = task.worker.toString();
    
    if (req.body.title) task.title = req.body.title;
    if (req.body.description) task.description = req.body.description;
    if (req.body.startDate) task.startDate = new Date(req.body.startDate);
    if (req.body.endDate) task.endDate = new Date(req.body.endDate);
    if (req.body.status) task.status = req.body.status;
    if (req.body.priority) task.priority = req.body.priority;
    if (req.body.hoursPerDay) task.hoursPerDay = req.body.hoursPerDay;
    if (req.body.color) task.color = req.body.color;
    if (req.body.worker) task.worker = req.body.worker;
    if (req.body.order !== undefined) task.order = req.body.order;
    task.updatedAt = Date.now();

    const updatedTask = await task.save();
    await updatedTask.populate('worker');
    await updatedTask.populate('department');

    // Reorder tasks if worker changed
    if (req.body.worker && oldWorkerId !== req.body.worker.toString()) {
      await reorderWorkerTasks(oldWorkerId);
      await reorderWorkerTasks(req.body.worker);
    } else {
      await reorderWorkerTasks(oldWorkerId);
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const workerId = task.worker.toString();
    await Task.deleteOne({ _id: req.params.id });
    
    // Reorder remaining tasks
    await reorderWorkerTasks(workerId);
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to reorder tasks for a worker
async function reorderWorkerTasks(workerId) {
  try {
    const tasks = await Task.find({ worker: workerId }).sort({ startDate: 1 });
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].order = i;
      await tasks[i].save();
    }
  } catch (error) {
    console.error('Error reordering tasks:', error);
  }
}

module.exports = router;
