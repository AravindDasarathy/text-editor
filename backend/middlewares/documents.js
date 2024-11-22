import { Document } from '../models/Document.js';
import { ForbiddenError, NotFoundError } from '../errors.js';
import { createInvitation } from '../services/document.js';
import { sendInvitationEmail } from '../services/email.js';
import logger from '../logger.js';

const getDocumentsHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const ownedDocuments = await Document.find({ owner: userId });
    const collaboratingDocuments = await Document.find({
      collaborators: userId,
    });

    res.json({ ownedDocuments, collaboratingDocuments });
  } catch (error) {
    next(error);
  }
};

const createDocumentHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    const newDocument = new Document({
      title,
      owner: userId,
      collaborators: [],
      content: {},
    });

    await newDocument.save();

    res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
};

const getDocumentHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const documentId = req.params.id;

    const document = await Document.findById(documentId);

    if (!document) throw new NotFoundError('Document not found');

    if (
      !document.owner.equals(userId) &&
      !document.collaborators.some((collaborator) =>
        collaborator.equals(userId)
      )
    ) {
      throw new ForbiddenError('You do not have access to this document');
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

const updateDocumentHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const documentId = req.params.id;
    const { content } = req.body;

    const document = await Document.findById(documentId);

    if (!document) throw new NotFoundError('Document not found');

    if (
      !document.owner.equals(userId) &&
      !document.collaborators.some((collaborator) =>
        collaborator.equals(userId)
      )
    ) {
      throw new ForbiddenError('You do not have access to this document');
    }

    document.content = content;
    await document.save();

    res.json(document);
  } catch (error) {
    next(error);
  }
};

const inviteCollaborator = async (req, res, next) => {
  const documentId = req.params.id;
  const { email } = req.body;
  const userId = req.user.userId; // From verifyAccessToken() middleware

  try {
    const invitation = await createInvitation(documentId, userId, email);

    logger.info({ message: 'Invitation created successfully', data: { invitation }});

    await sendInvitationEmail(req.id, invitation);

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  getDocumentsHandler,
  createDocumentHandler,
  getDocumentHandler,
  updateDocumentHandler,
  inviteCollaborator
};