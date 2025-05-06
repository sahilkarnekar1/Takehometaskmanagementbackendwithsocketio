const router = require('express').Router();
const { register, login, getAllTeamLeadersForRegistrationMember } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/getAllTeamLeadersForRegistrationMember', getAllTeamLeadersForRegistrationMember);

module.exports = router;