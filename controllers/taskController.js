const Task = require('../models/Task');
const Team = require('../models/Team');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      createdBy: req.user.id,
      teamId: req.body.teamId,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
    });

 const populatedTask = await Task.findById(task._id)
    .populate('createdBy', '_id name email')
    .populate('assignedTo', '_id name email');

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// pending
exports.getMyTasksInTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).send('Team not found');

    // Check if logged-in user is a member of the team
    if (!team.members.map(m => m.toString()).includes(req.user.id)) {
      return res.status(403).send('You are not a member of this team');
    }

    // Fetch tasks with user details populated
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
    .populate('createdBy', '_id name email')
    .populate('assignedTo', '_id name email');

    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.send('Task deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
