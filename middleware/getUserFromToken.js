const jwt = require('jsonwebtoken');

const getUserFromToken = (token) => {
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded;
    return user;
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = getUserFromToken;
