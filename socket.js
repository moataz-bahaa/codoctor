import { io } from './app.js';

export const sendMessage = async (msg) => {
  msg.chat?.users?.forEach((user) => {
    if (user.id === msg.senderId) return;

    io.to(user.id).emit('new-msg', msg);
  });
};
