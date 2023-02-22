import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import path from 'path';

// middlewares

// routes
import adminRoutes from './routes/admin';
import doctorRoutes from './routes/doctor';
import patientRoutes from './routes/patient';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // adds some http headers for security
app.use(express.static(path.resolve('data')));

// routes
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

// ************************
// socket
// ************************
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// room -> chatId
io.on('connection', (socket) => {
  socket.on('setup', (user) => {
    socket.join(user.id);
    socket.emit('connected');
  });

  socket.on('join-chet', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop-typing', (room) => socket.in(room).emit('stop-typing'));

  socket.on('send-msg', (message) => {
    const chat = message.chat;

    if (!chat.users) return;

    // this will send message for only users opening that chat
    // socket.in(chat.id).emit('recieve-msg', message);

    chat.users.forEach((user: any) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit('recieve-msg', message);
    });
  });

  socket.off('setup', (user) => {
    socket.leave(user.id);
  });
});
