import winston from 'winston';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.File({
      // for prod: /var/log/server.log
      filename: 'server.log'
    })
  ]
});

if (process.env.NODE_ENV !== 'PROD') {
  logger.add(
    new winston.transports.Console()
  );
}

export default logger;