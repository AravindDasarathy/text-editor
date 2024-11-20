import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { clientConfigs } from './configs/app.js';
import { AppEvents } from './configs/eventTypes.js';
import Routes from './api/index.js';
import {
  requestIdGenerator,
  requestLogger,
  undefinedRoutesHandler,
  globalErrorHandler
} from './middlewares/index.js';

import { Document } from './models/Document.js';
import jwt from 'jsonwebtoken';
import { jwtConfigs } from './configs/app.js';

const app = express();

app.use(cors({
  origin: clientConfigs.url,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestIdGenerator);
app.use(requestLogger);
app.use(Routes());
app.use(undefinedRoutesHandler);
app.use(globalErrorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [clientConfigs.url],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Unauthorized'));

  jwt.verify(token, jwtConfigs.accessTokenSecret, (err, payload) => {
    if (err) return next(new Error('Unauthorized'));
    console.log(payload);
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

export default httpServer;