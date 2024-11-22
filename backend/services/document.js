import { v4 as uuid } from 'uuid';
import logger from '../logger.js';
import { findDocumentByIdDb } from '../data_access/document.js';
import { getUserByEmailFromDb } from '../data_access/user.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../errors.js';
import { getInvitationByParams, saveInvitation } from '../data_access/invitation.js';

const createInvitation = async (documentId, inviterId, inviteeEmail) => {
  try {
    const existingInvitation = await getInvitationByParams({
      email: inviteeEmail,
      documentId,
      status: 'pending'
    });

    // Check if invitation already sent
    if (existingInvitation) {
      logger.info({ message: 'Invitation already sent', data: {
        documentId,
        inviterId,
        inviteeEmail
      }});

      throw new ConflictError('An invitation has already been sent to this email');
    }

    const document = await findDocumentByIdDb(documentId);

    if (!document) {
      logger.info({ message: 'Document not found', data: {
        documentId,
        inviterId,
        inviteeEmail
      }});

      throw new NotFoundError('Document not found');
    }

    // Check if the requester is the owner
    if (!isOwner(document, inviterId)) {
      logger.info({ message: 'User not authorized to invite collaborators', data: {
        documentId,
        inviterId,
        inviteeEmail
      }});

      throw new ForbiddenError('User not authorised to invite collaborators');
    }

    // Check if the user to invite exists
    const invitee = await getUserByEmailFromDb(inviteeEmail);

    if (!invitee) {
      logger.info({ message: 'Invitee user not found', data: {
        documentId,
        inviterId,
        inviteeEmail
      }});

      throw new NotFoundError('Invitee user not found');
    }

    // Check if already a collaborator
    if (isCollaborator(document, invitee._id)) {
      logger.info({ message: 'Invitee is already a collaborator', data: {
        documentId,
        inviterId,
        inviteeEmail
      }});

      throw new BadRequestError('Invitee is already a collaborator');
    }

    // Add to invitations
    console.log({
      email: inviteeEmail,
      documentId,
      token: uuid()
    });

    return saveInvitation({
      email: inviteeEmail,
      documentId,
      token: uuid()
    });
  } catch (error) {
    console.error('Error in processing create invitation - ', error);
    throw error;
  }
};

const isOwner = (document, userId) => document.owner.equals(userId);

const isCollaborator = (document, userId) => document.collaborators.includes(userId);

export {
  createInvitation
};