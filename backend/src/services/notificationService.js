import { createNotification } from '../models/notificationModel.js';
import { getIO } from '../config/socket.js';
import { sendEmail } from './emailService.js';

export const notifyUser = async ({ userId, email, message, subject = 'Event Management Update' }) => {
  const notification = await createNotification({ userId, message });

  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('notification:new', notification);
  } catch (error) {
    console.log('Socket not ready, notification stored only');
  }

  if (email) {
    await sendEmail({
      to: email,
      subject,
      html: `<p>${message}</p>`,
    });
  }

  return notification;
};