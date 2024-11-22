import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clientConfigs } from './configs/app.js';
import Routes from './api/index.js';
import {
  requestIdGenerator,
  requestLogger,
  undefinedRoutesHandler,
  globalErrorHandler
} from './middlewares/index.js';

import initializeSocketServer from './socket.js';

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

initializeSocketServer(httpServer);

export default httpServer;