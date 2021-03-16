import * as grpc from '@grpc/grpc-js';

import { RecipeService, IRecipeServer } from '../proto/recipe_grpc_pb';
import { Empty, Pong, RecipeId, RecipeMessage, Status } from '../proto/recipe_pb';
import { fromRecipeProto, toRecipeProto } from '../utilities';
import { IRecipeDocument, RecipeModel } from '../database';
import { CallbackError } from 'mongoose';

class RecipeHandler implements IRecipeServer {
  [name: string]: grpc.UntypedHandleCall;
  addRecipe = (call: grpc.ServerUnaryCall<RecipeMessage, Status>, callback: grpc.sendUnaryData<Status>): void => {
    const recipe = fromRecipeProto(call.request);
    console.info(`adding recipe: ${recipe.recipeName}`);
    const statusMessage = new Status();
    RecipeModel.create(recipe, (err, docs) => {
      if (err) {
        statusMessage
          .setCode(500)
          .setDescription(err.message)
          .setIsError(true);
      } else {
        statusMessage
          .setCode(200)
          .setDescription(`Added recipe: ${docs.recipeName} | ${docs.id}`)
          .setIsError(true);
      }
      callback(null, statusMessage);
    });
  };

  getRecipe = (call: grpc.ServerUnaryCall<RecipeId, RecipeMessage>, callback: grpc.sendUnaryData<RecipeMessage>): void => {
    console.info(`retrieving info for recipe: ${call.request.getId()}`);
    RecipeModel.findById(call.request.getId(), (err: CallbackError, docs: IRecipeDocument) => {
      if (err) throw err;
      callback(null, toRecipeProto(docs))
    });
  };

  getAllRecipes = async (call: grpc.ServerWritableStream<Empty, RecipeMessage>): Promise<void> => {
    console.info('retrieving all recipes!');
    const recipes = await RecipeModel.find({});
    recipes.forEach(recipe => {
      call.write(toRecipeProto(recipe));
    });
    call.end();
  }

  updateRecipe = (call: grpc.ServerUnaryCall<RecipeMessage, Status>, callback: grpc.sendUnaryData<Status>): void => {
    console.info(`updating info for recipe: ${call.request.getName()}`);
    const statusMessage = new Status();
    RecipeModel.updateOne(
      { _id: call.request.getId() },
      fromRecipeProto(call.request),
      {},
      (err: CallbackError, docs: IRecipeDocument) => {
        if (err) {
          statusMessage
            .setCode(500)
            .setDescription(err.message)
            .setIsError(true);
        } else {
          statusMessage
            .setCode(200)
            .setDescription(`Updated recipe: ${docs.recipeName} | ${docs.recipeId}`)
            .setIsError(false);
        }
    });
    callback(null, statusMessage);
  };

  deleteRecipe = (call: grpc.ServerUnaryCall<RecipeId, Status>, callback: grpc.sendUnaryData<Status>): void => {
    console.info(`removing recipe: ${call.request.getId()}`);
    const statusMessage = new Status();
    // database logic
    RecipeModel.findById(call.request.getId(), (err: CallbackError, docs: IRecipeDocument) => {
      if (err) {
        statusMessage
          .setCode(500)
          .setDescription(err.message)
          .setIsError(true);
      } else {
        docs.delete({}, (deleteErr: CallbackError, res) => {
          if (deleteErr) {
            statusMessage
              .setCode(500)
              .setDescription(deleteErr.message)
              .setIsError(true);
          } else {
            statusMessage
              .setCode(200)
              .setDescription(`Removed recipe: ${docs.recipeName} | ${docs.recipeId}`)
              .setIsError(false);
          }
        });
      }
    });
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
