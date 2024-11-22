import { Invitation } from '../models/Invitation.js';

const getInvitationByParams = (params = {}, options = {}) =>
  Invitation.findOne(params).session(options.session);

const saveInvitation = (invitation) => new Invitation(invitation).save();

export {
  getInvitationByParams,
  saveInvitation
};