/**
 * Node modules
 */
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

/**
 * Custom modules
 */
import config from '@/config';
import router from '@/routes/v1';
import corsOptions from '@/lib/cors';
import { logger } from '@/lib/winston';
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose';

const server = express();

/**
 * Use cors
 */
server.use(cors(corsOptions));

/**
 * Secure headers
 */
server.use(helmet());

/**
 * Parse JSON requesr bodies
 */
server.use(express.json());

/**
 * Parse URL encoded-bodies
 */
server.use(express.urlencoded({ extended: true }));

/**
 * Set the public folder
 */
server.use(express.static(`${__dirname}/public`));

/**
 * Cookie parser
 */
server.use(cookieParser());

/**
 * Compress response
 */
server.use(compression());

(async function (): Promise<void> {
  try {
    await connectDatabase();

    server.use('/api/v1/', router);

    server.listen(config.PORT, () => {
      logger.info(`Server listening at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectDatabase();
    logger.info('Server shutdown', signal);
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);
