import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
// swagger
import swaggerUi from 'swagger-ui-express';

// middlewares
import errorHandler from './middlewares/error-handerl.js';
// routes
import adminRoutes from './routes/admin.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';
import userRoutes from './routes/user.js';

const app = express();

// middlewares
app.use(
  cors({
    origin: '*',
  })
);
app.use('/files', express.static(path.resolve('files')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // adds some http headers for security
app.use(express.static(path.resolve('data')));

// routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

// swagger routes
app.use('/docs/json', (req, res) =>
  res.json(JSON.parse(fs.readFileSync(path.resolve('swagger', 'swagger.json'))))
);
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(
    JSON.parse(fs.readFileSync(path.resolve('swagger', 'swagger.json')))
  )
);

app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

// socket server
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// room -> chatId
io.on('connection', (socket) => {
  socket.on('setup', (userId) => {
    socket.join(userId);
    socket.emit('connected');
  });

  socket.on('disconnect', () => {
    // Remove the user from any rooms they are in
    Object.keys(socket.rooms).forEach((room) => {
      socket.leave(room);
    });
  });
});

export const sendMessageToSocket = async (msg) => {
  msg.chat?.users?.forEach((user) => {
    // if (user.userId === msg.senderId) return;
    io.to(user.userId).emit('new-msg', msg);
  });
};
