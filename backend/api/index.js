import { Router } from 'express';
import authRouter from './auth.js';
import documentRouter from './document.js';

export default () => {
  const app = Router();

  app.use(authRouter);
  app.use('/documents', documentRouter);

  return app;
}