import * as grpc from '@grpc/grpc-js';

import { RecipeService, IRecipeServer } from '../proto/recipe_grpc_pb';
import { Empty, Pong, RecipeId, RecipeMessage, Status } from '../proto/recipe_pb';

class RecipeHandler implements IRecipeServer {
  [name: string]: grpc.UntypedHandleCall;
  addRecipe = (call: grpc.ServerUnaryCall<RecipeMessage, Status>, callback: grpc.sendUnaryData<Status>): void => {
    console.info(`adding recipe: ${call.request.getName()}`);
    const statusMessage = new Status();
    // database logic
    callback(null, statusMessage);
  };

  getRecipe = (call: grpc.ServerUnaryCall<RecipeId, RecipeMessage>, callback: grpc.sendUnaryData<RecipeMessage>): void => {
    console.info(`retrieving info for recipe: ${call.request.getId()}`);
    // database logic
    const recipe = new RecipeMessage();
    callback(null, recipe);
  };

  updateRecipe = (call: grpc.ServerUnaryCall<RecipeMessage, Status>, callback: grpc.sendUnaryData<Status>): void => {
    console.info(`updating info for recipe: ${call.request.getName()}`);
    const statusMessage = new Status();
    // database logic
    callback(null, statusMessage);
  };

  deleteRecipe = (call: grpc.ServerUnaryCall<RecipeId, Status>, callback: grpc.sendUnaryData<Status>): void => {
    console.info(`removing recipe: ${call.request.getId()}`);
    const statusMessage = new Status();
    // database logic
    callback(null, statusMessage);
  };

  ping = (call: grpc.ServerUnaryCall<Empty, Pong>, callback: grpc.sendUnaryData<Pong>): void => {
    console.info('we have been pinged, send a pong!');
    callback(null, new Pong().setResponse('hi client'));
  };
}

export default {
  service: RecipeService,
  handler: new RecipeHandler()
}
