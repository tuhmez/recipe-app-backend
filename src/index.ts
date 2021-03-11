import recipeServer from './communications';

const server = new recipeServer();

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  server.shutdown();
});
