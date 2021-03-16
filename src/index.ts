import recipeServer from './communications';
import { connect, disconnect } from './database';

const server = new recipeServer();

connect();

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  server.shutdown();
  disconnect();
});
