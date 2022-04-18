import chalk from 'chalk';
import { Communications } from './communications';
import { connect, disconnect } from './database';

require('dotenv').config();

const port = process.env.RECIPE_SERVICE_PORT ? Number(process.env.RECIPE_SERVICE_PORT) : 3001;

connect();

const server = new Communications(port);

process.on('SIGINT', function () {
  console.log(chalk.red('Caught interrupt signal, shutting down...'));
  if (server) {
    if (server.socket) server.socket.disconnect();
    if (server.server) server.server.close();
    server.io.close();
  }
  disconnect();
});
