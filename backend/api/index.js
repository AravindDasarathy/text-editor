import { Router } from 'express';
import authRouter from './auth.js';
import documentRouter from './document.js';
import invitationRouter from './invitation.js';

export default () => {
  const app = Router();

  app.use(authRouter);
  app.use('/documents', documentRouter);
  app.use('/', invitationRouter);

  return app;
}