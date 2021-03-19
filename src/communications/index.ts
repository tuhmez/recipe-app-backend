import * as grpc from '@grpc/grpc-js';
import ip from 'ip';
import recipe from './recipeServiceImpl';

class Communications {
  public server: grpc.Server;
  public serverPort: string = process.env.RECIPE_SERVICE_PORT || '3001';

  constructor() {
    this.server = new grpc.Server();
    // @ts-ignore
    this.server.addService(recipe.service, recipe.handler);
    this.server.bindAsync(`0.0.0.0:${this.serverPort}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) throw err;
      console.info(`Recipe gRPC server started at: [localhost | ${ip.address()}]:${port}`);
      this.server.start();
    });
  }

  shutdown(): void {
    this.server.tryShutdown((err) => {
      if (err) throw err;
      console.info('Server shut down successfully!');
    });
  }
}

export default Communications;
