require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const getUserFromToken = require('./middleware/getUserFromToken');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // allow all or restrict to specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/task', taskRoutes);
app.get('/', (req, res) => res.send('Hello Api'));


const connectedUsers = {}; // userId -> socket.id
const pendingTasks = {};
// Socket.IO Logic
io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('connectedUserForTeam', token => {
    const user = getUserFromToken(token);
    const userId = user.id;
    
    connectedUsers[userId] = socket.id;
    console.log(`🧍 Connected user ${userId} to socket ${socket.id}`);

    if (pendingTasks[userId]) {
      pendingTasks[userId].forEach(task => {
        socket.emit('taskAssigned', task);
      });
      delete pendingTasks[userId];
    }
  });

  socket.on('createTask', ({ assignedTo, task }) => {
    const receiverSocketId = connectedUsers[assignedTo];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('taskAssigned', task);
    } 
    // else {
    //   if (!pendingTasks[assignedTo]) {
    //     pendingTasks[assignedTo] = [];
    //   }
    //   pendingTasks[assignedTo].push(task);
    // }
  });

  socket.on('deleteTask', ({ token, task }) => {
    const user = getUserFromToken(token);
    if (!user || !task?.createdBy?._id || !task?.assignedTo?._id) return;
  
    const userId = user.id;
    const createdBy = task.createdBy;
    const assignedTo = task.assignedTo;
  
    const isCreator = userId === createdBy._id;
    const receiver = isCreator ? assignedTo : createdBy;
    const senderName = isCreator ? createdBy.name : assignedTo.name;
  
    const receiverSocketId = connectedUsers[receiver._id];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('taskDeleted', {
        task,
        message: `Your task "${task.title}" has been deleted by ${senderName}.`
      });
    }
  });
  
  







  socket.on('menualDisconnect', () => {
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        console.log(`❌ Disconnected user ${userId}`);
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        console.log(`❌ Disconnected user ${userId}`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
