const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', [
  query('status').optional().isIn(['todo', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('sort').optional().isIn(['createdAt', 'dueDate', 'priority', 'title']),
  query('order').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort(sortObj);

    res.json({
      tasks,
      count: tasks.length
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics for the authenticated user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.getUserStats(req.user._id);
    
    res.json({
      stats: stats[0] || {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });

  } catch (error) {
    console.error('Get task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = new Task({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      userId: req.user._id
    });

    await task.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('task-created', { task });
    }

    res.status(201).json({
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    const updateFields = ['title', 'description', 'status', 'priority', 'dueDate', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('task-updated', { task });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('task-deleted', { taskId: req.params.id });
    }

    res.json({
      message: 'Task deleted successfully',
      taskId: req.params.id
    });

  } catch (error) {
    console.error('Delete task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', [
  body('status')
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = req.body.status;
    await task.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('task-updated', { task });
    }

    res.json({
      message: 'Task status updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task status error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 