const router = require('express').Router();
const { createTask, updateTask, deleteTask, getMyTasksInTeam } = require('../controllers/taskController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/createTask', verifyToken, createTask);
router.get('/getMyTasksInTeam/:teamId', verifyToken, getMyTasksInTeam);
router.put('/updateTask/:taskId', verifyToken, updateTask);
router.delete('/deleteTask/:taskId', verifyToken, deleteTask);

module.exports = router;