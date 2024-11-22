import express from 'express';
import { acceptInvitationHandler } from '../middlewares/invitation.js';
import { verifyAccessToken } from '../middlewares/index.js';

const router = express.Router();

router.get('/accept-invite', verifyAccessToken, acceptInvitationHandler);

export default router;
