import mongoose from 'mongoose';
import logger from './logger.js';
import { dbConfigs } from './configs/app.js';

export const connectDB = async () => {
  try {
    const mongodb = await mongoose.connect(dbConfigs.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${mongodb.connection.host}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
