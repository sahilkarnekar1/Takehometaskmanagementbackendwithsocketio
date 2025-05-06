const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password, role, teamLeader } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    if (role === 'Member') {
      if (!teamLeader) {
        return res.status(400).send('TeamLeader ID is required for a Member');
      }

      const leader = await User.findById(teamLeader);
      if (!leader || leader.role !== 'TeamLeader') {
        return res.status(400).send('Invalid TeamLeader ID');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      teamLeader: role === 'Member' ? teamLeader : null
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAllTeamLeadersForRegistrationMember = async (req, res) => {
  try {
    const usersTL = await User.find({ role: "TeamLeader" }).select('-password');
    if (usersTL.length === 0) return res.status(400).send('No Team Leaders Found');
    res.json(usersTL);
  } catch (err) {
    res.status(500).send(err.message);
  }
};