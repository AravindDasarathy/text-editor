import { Router } from 'express';
import {
  loginHandler,
  userRegisterationHandler,
  userVerificationHandler,
  userValidator,
  refreshTokenHandler,
  logoutHandler
} from '../middlewares/index.js';

const router = Router();

router.post('/login', loginHandler);

router.post('/register', userValidator, userRegisterationHandler);

router.get('/verify/:token', userVerificationHandler);

router.post('/refresh-token', refreshTokenHandler);

router.post('/logout', logoutHandler);


export default router;
