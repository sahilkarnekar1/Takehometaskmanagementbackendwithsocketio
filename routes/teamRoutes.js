const router = require('express').Router();
const { createTeam, addMember, getMyTeams, getNonMembers, getTeamMembers, getUserFromToken } = require('../controllers/teamController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, createTeam);
router.put('/:teamId/add-members', verifyToken, addMember);
router.get('/my-teams', verifyToken, getMyTeams);
router.get('/:id/non-members', verifyToken, getNonMembers);
router.get('/:teamId/getTeamMembers', verifyToken, getTeamMembers);

router.get('/getUserFromToken', verifyToken, getUserFromToken);


module.exports = router;