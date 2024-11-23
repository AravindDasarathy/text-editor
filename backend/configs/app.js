import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'PROD') {
  dotenv.config();
}

export const clientConfigs = {
  url: 'http://localhost:3000'
};

export const serverConfigs = {
  port: 3001,
  domain: 'localhost',
  get url() {
    return `http://${this.domain}:${this.port}`
  }
};

export const jwtConfigs = {
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '2d'
};

export const cookieConfigs = {
  refreshTokenExpiry: 1000 * 60 * 60 * 24 * 2
};

export const dbConfigs = {
  url: process.env.MONGO_URI
};

export const verificationTokenConfigs = {
  expiry: 60 * 60 * 1000
};

export const mailgunConfigs = {
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_API_DOMAIN,
  get apiUrl() {
    return `https://api.mailgun.net/v3/${this.domain}/messages`;
  }
};

export const verificationConfigs = {
  fromEmail: process.env.MAILGUN_FROM_EMAIL || 'aravind.dasarat@gmail.com',
  subject: 'Text Editor - Email Verification',
  body: 'Thank you for creating an account with us! Please verify your email address within 3 minutes'
};

export const invitationConfigs = {
  states: ['pending', 'accepted', 'rejected'],
  expiry: 60 * 60 * 1000,
  email: {
    subject: 'Text Editor - Collaborator Invitation',
    body: "You've been invited to collaborate on document"
  }
};