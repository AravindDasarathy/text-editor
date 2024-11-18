import dotenv from 'dotenv';

dotenv.config();

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
  expiry: '10m',
  secret: process.env.JWT_SECRET
};

export const dbConfigs = {
  url: process.env.MONGO_URI
};

export const verificationTokenConfigs = {
  // 3 minutes
  expiry: 3 * 60 * 1000
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