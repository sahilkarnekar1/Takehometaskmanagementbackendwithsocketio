const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: Date,
  });
  
  module.exports = mongoose.model('Task', taskSchema);