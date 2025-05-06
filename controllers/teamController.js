const Team = require('../models/Team');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
  if (req.user.role !== 'TeamLeader') return res.status(403).send('Only TeamLeader can create teams');
  try {
    const team = await Team.create({ name: req.body.name, teamLeader: req.user.id, members: [req.user.id] });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addMember = async (req, res) => {
  const { memberIds } = req.body; // Expecting an array
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).send('Team not found');
    if (team.teamLeader.toString() !== req.user.id) return res.status(403).send('Not authorized');

    const validUsers = await User.find({ _id: { $in: memberIds } });
    if (validUsers.length === 0) return res.status(404).send('No valid users found');

    const newMembers = validUsers
      .map(user => user._id.toString())
      .filter(id => !team.members.map(m => m.toString()).includes(id));

    team.members.push(...newMembers);
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user.id
    }).populate('teamLeader members', 'name email role');
    res.json(teams);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getNonMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).send('Team not found');

    const nonMembers = await User.find({
      teamLeader: req.user.id,
      _id: { $nin: team.members },
      role: 'Member'
    }).select('_id name email');

    res.json(nonMembers);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).populate('members', '_id name email');
    if (!team) return res.status(404).send('Team not found');

    res.json(team.members);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUserFromToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
