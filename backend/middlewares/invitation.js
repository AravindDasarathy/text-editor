import { HTTP_STATUS_CODES } from '../constants.js';
import { processInvitationAcceptance } from '../services/invitation.js';

const acceptInvitationHandler = async (req, res, next) => {
  const { token } = req.query;
  const userId = req.user.userId; // from verifyAccessToken() middleware

  try {
    const invitation = await processInvitationAcceptance(token, userId);

    res.status(HTTP_STATUS_CODES.OK).json({
      message: 'Invitation accepted successfully',
      documentId: invitation.documentId
    });
  } catch (error) {
    next(error);
  }
};


export {
  acceptInvitationHandler
};