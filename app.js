import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import helmet from 'helmet';
import { Server } from 'socket.io';

// middlewares
import errorHandler from './middlewares/error-handler.js';

// routes
import adminRoutes from './routes/admin.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';
import path from 'path';

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
app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);

app.use(errorHandler);

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

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit('recieve-msg', message);
    });
  });

  socket.off('setup', (user) => {
    socket.leave(user.id);
  });
});
