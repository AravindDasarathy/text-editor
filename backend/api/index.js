import { Router } from 'express';
import authRouter from './auth.js';

export default () => {
  const app = Router();

  app.use(authRouter);

  return app;
}