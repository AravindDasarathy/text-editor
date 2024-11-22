import FormData from 'form-data';
import axios from 'axios';
import { clientConfigs, invitationConfigs, mailgunConfigs, serverConfigs, verificationConfigs } from '../configs/app.js';
import logger from '../logger.js';
import { ServiceUnavailableError } from '../errors.js';

const sendEmail = async (reqId, emailOptions) => {
  const formData = new FormData();

  formData.append('from', emailOptions.from);
  formData.append('to', emailOptions.to);
  formData.append('subject', emailOptions.subject);
  formData.append('text', emailOptions.text);

  const auth = 'Basic ' + Buffer.from(`api:${mailgunConfigs.apiKey}`).toString('base64');

  const requestDetails = {
    method: 'POST',
    url: mailgunConfigs.apiUrl,
    headers: {
      'Authorization': auth,
      ...formData.getHeaders(),
    },
    data: formData,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(requestDetails);

    logger.info({ id: reqId, message: 'Email sent successfully', data: response.data });
  } catch (error) {
    logger.error({
      id: reqId,
      message: 'Mailgun API error',
      error
    });

    throw new ServiceUnavailableError('Failed to send email');
  }
};

const generateVerificationEmailContent = (username, url) =>
  `Hello ${username},\n\n${verificationConfigs.body}: ${url}\n\nRegards,\nText Editor Team.`;

const sendVerificationEmail = async (reqId, user) => {
  const verificationUrl = `${serverConfigs.url}/verify/${user.verificationToken}`;

  const emailOptions = {
    from: verificationConfigs.fromEmail,
    to: user.email,
    subject: verificationConfigs.subject,
    text: generateVerificationEmailContent(user.username, verificationUrl)
  };

  await sendEmail(reqId, emailOptions);
};

const generateInvitationEmailContent = (url) =>
  `Hello,\n\n${invitationConfigs.email.body}: ${url}\n\nRegards,\nText Editor Team.`;

const sendInvitationEmail = async (reqId, invitation) => {

  const invitationUrl = `${clientConfigs.url}/accept-invite?token=${invitation.token}`;

  const emailOptions = {
    from: verificationConfigs.fromEmail,
    to: invitation.email,
    subject: invitationConfigs.email.subject,
    text: generateInvitationEmailContent(invitationUrl)
  };

  await sendEmail(reqId, emailOptions);
};

export {
  sendVerificationEmail,
  sendInvitationEmail
};
