import { Router } from 'express';
import {
  getDocumentsHandler,
  createDocumentHandler,
  getDocumentHandler,
  updateDocumentHandler,
  inviteCollaborator,
  verifyAccessToken
} from '../middlewares/index.js';

const router = Router();

router.use(verifyAccessToken);

router.get('/', getDocumentsHandler);

router.post('/', createDocumentHandler);

router.get('/:id', getDocumentHandler);

router.put('/:id', updateDocumentHandler);

router.post('/:id/invite', inviteCollaborator);

export default router;
