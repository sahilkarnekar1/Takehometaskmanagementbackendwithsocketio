const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['TeamLeader', 'Member'], default: 'Member' },
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Only for Members
});

module.exports = mongoose.model('User', userSchema);