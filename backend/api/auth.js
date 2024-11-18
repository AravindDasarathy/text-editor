import { Router } from 'express';
import {
  loginHandler,
  userRegisterationHandler,
  userVerificationHandler,
  userValidator
} from '../middlewares/index.js';

const router = Router();

router.post('/login', loginHandler);

router.post('/register', userValidator, userRegisterationHandler);

router.get('/verify/:token', userVerificationHandler);

export default router;
