import recipeServer from './communications';
import { connect, disconnect } from './database';

connect();

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  disconnect();
});
