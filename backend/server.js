import { serverConfigs } from './configs/app.js';
import app from './app.js';
import logger from './logger.js';
import { connectDB } from './db.js';

connectDB();

app.listen(serverConfigs.port, () => {
  logger.info(`Server is running on ${serverConfigs.port}`);
})

app.on('error', error => {
  logger.error(error);
  process.exit(1);
});

// const shutdown = () => {
//   logger.info({ message: 'Exiting' });

//   app.close(() => {
//     process.exit(0);
//   });
// };

// process.on('SIGINT', shutdown);
// process.on('SIGUSR1', shutdown);
// process.on('SIGUSR2', shutdown);
// process.on('exit', shutdown);