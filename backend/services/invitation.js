import logger from '../logger.js';

import { getInvitationByParams, saveInvitation } from '../data_access/invitation.js';
import { findUserByIdFromDb } from '../data_access/user.js'
import { addCollaboratorToDocumentDb } from '../data_access/document.js';
import { BadRequestError, ForbiddenError } from '../errors.js';

const processInvitationAcceptance = async (token, userId) => {
  try {
    // console.log(token, userId);
    const invitation = await getInvitationByParams({ token, status: 'pending' });

    if (!invitation) {
      logger.info({ message: 'Invitation not found', data: { token }});

      throw new BadRequestError('Invalid or expired invitation');
    }

    // Verify the email matches
    const user = await findUserByIdFromDb(userId);

    if (user.email !== invitation.email) {
      logger.info({ message: 'Logged in user is not the same as invitee', data: {
        token,
        invitation,
        user
      }});

      throw new ForbiddenError('Invalid invitation');
    }

    /**
     * Ideally, writing document and invitation models must be an atomic operation.
     * For simplicity, letting them happen non atomic.
     * Adding collaborator to document first and then marking the invitation as 'accepted' next.
     * Better than the other way around.
     */

    // Add user to document collaborators
    await addCollaboratorToDocumentDb(invitation.documentId, userId);

    logger.info({ message: 'Added user as a collaborator to document successfully', data: {
      invitation,
      user
    }});

    // Update invitation status
    invitation.status = 'accepted';

    await saveInvitation(invitation);

    logger.info({ message: 'Updated invitation status to accepted from pending successfully', data: {
      invitation,
      user
    }});

    return invitation;
  } catch (error) {
    throw error;
  }
}

export {
  processInvitationAcceptance
};