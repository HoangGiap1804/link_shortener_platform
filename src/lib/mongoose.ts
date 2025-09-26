/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

const connectionOption: ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'shortly',
};

const connectDatabase = async (): Promise<void> => {
  if (!config.MONGO_CONNECTION_URL) {
    throw new Error('Mongo url is missing');
  }

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URL, connectionOption);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connected database', error);
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error during disconnecting from database', error);
  }
};

export { connectDatabase, disconnectDatabase };
