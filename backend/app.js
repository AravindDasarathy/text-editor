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
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  socket.on(AppEvents.SEND_CHANGES, (delta) => {
    socket.broadcast.emit(AppEvents.RECEIVE_CHANGES, delta);
  });
});

export default httpServer;