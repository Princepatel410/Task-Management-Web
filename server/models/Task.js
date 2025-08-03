const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

// Pre-save middleware to update isCompleted and completedAt
taskSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  } else if (this.status !== 'completed' && this.isCompleted) {
    this.isCompleted = false;
    this.completedAt = null;
  }
  next();
});

// Instance method to mark as completed
taskSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

// Instance method to mark as in progress
taskSchema.methods.markAsInProgress = function() {
  this.status = 'in-progress';
  this.isCompleted = false;
  this.completedAt = null;
  return this.save();
};

// Instance method to mark as todo
taskSchema.methods.markAsTodo = function() {
  this.status = 'todo';
  this.isCompleted = false;
  this.completedAt = null;
  return this.save();
};

// Static method to get tasks by user
taskSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.priority) {
    query.priority = options.priority;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get task statistics for a user
taskSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
        lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Task', taskSchema); 