import { Server } from 'socket.io';
import { clientConfigs } from './configs/app.js';
import { Document } from './models/Document.js';
import jwt from 'jsonwebtoken';
import { jwtConfigs } from './configs/app.js';

function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [clientConfigs.url],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));

    jwt.verify(token, jwtConfigs.accessTokenSecret, (err, payload) => {
      if (err) return next(new Error('Unauthorized'));

      socket.data.userId = payload.userId;
      next();
    });
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    socket.on('join-document', async ({ documentId }) => {
      const userId = socket.data.userId;
      const document = await Document.findById(documentId);

      if (!document) {
        socket.emit('error', 'Document not found');
        return;
      }

      if (
        !document.owner.equals(userId) &&
        !document.collaborators.some((collaborator) =>
          collaborator.equals(userId)
        )
      ) {
        socket.emit('error', 'Access denied');
        return;
      }

      socket.join(documentId);

      socket.emit('load-document', document.content);

      socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save-document', async (content) => {
        await Document.findByIdAndUpdate(documentId, { content });
      });
    });
  });

  return io;
}

export default initializeSocketServer;
