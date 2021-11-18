import { Server, createServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from "socket.io";
import chalk from 'chalk';
import { address } from 'ip';
import { v4 as uuidv4 } from 'uuid';
import {
  ADD_RECIPE_REQUEST,
  ADD_RECIPE_RESPONSE,
  EDIT_RECIPE_REQUEST,
  EDIT_RECIPE_RESPONSE,
  DELETE_RECIPE_REQUEST,
  DELETE_RECIPE_RESPONSE,
  GET_RECIPES_REQUEST,
  GET_RECIPES_RESPONSE,
  GET_RECIPE_BY_ID_REQUEST,
  PING,
  PONG,
} from './constants';
import {
  IAddRecipeRequest,
  IAddRecipeResponse,
  IEditRecipeRequest,
  IEditRecipeResponse,
  IDeleteRecipeRequest,
  IDeleteRecipeResponse,
  IGetRecipeByIdRequest,
  IGetRecipesResponse,
} from './interfaces';
import { IRecipe } from "../common/types";
import { RecipeModel } from "../database";
import { databaseDocumentToRecipe } from "../utils/converters";

export class Communications {
  public server: Server;
  public io: SocketServer;
  public socket: Socket | null = null;

  constructor(port: number) {
    const app = express();
    this.server = createServer(app);
    this.io = new SocketServer(this.server, { cors: { origin: '*' } });

    this.io.on('connect', (socket) => {
      console.info(chalk.cyan(`Connected ${socket.id}`));
      socket
        .on(PING, () => {
          socket.emit(PONG, { status: 'OK' });
        })
        .on(ADD_RECIPE_REQUEST, (request: IAddRecipeRequest) => {
          if (!request) {
            const error = 'Invalid recipe request!';
            console.info(chalk.red(error));
            const res: IAddRecipeResponse = {
              error
            };
            socket.emit(ADD_RECIPE_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Add recipe request...'));
          RecipeModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IAddRecipeResponse = {
                error: JSON.stringify(err)
              }
              socket.emit(ADD_RECIPE_RESPONSE, res);
              return;
            }
            request.recipeId = uuidv4();
            new RecipeModel(request)
              .save()
              .then(
                (doc) => {
                  const newRecipe = databaseDocumentToRecipe(doc, false);
                  console.info(chalk.green(`Added recipe ${newRecipe.name}!`));
                  const res: IAddRecipeResponse = {
                    recipe: newRecipe
                  };
                  socket.emit(ADD_RECIPE_RESPONSE, res);
                },
                (err) => {
                  console.info(chalk.red(err));
                  const res: IAddRecipeResponse = {
                    error: JSON.stringify(err)
                  };
                  socket.emit(ADD_RECIPE_RESPONSE, res);
                }
              );
          });
        })
        .on(EDIT_RECIPE_REQUEST, (request: IEditRecipeRequest) => {
          const { recipeId } = request;
          console.info(chalk.green('Edit recipe request...'));
          RecipeModel.findOneAndUpdate({ recipeId }, request, { new: true }, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IEditRecipeResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(EDIT_RECIPE_RESPONSE, res);
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              const res: IEditRecipeResponse = {
                error: JSON.stringify(error)
              }
              socket.emit(EDIT_RECIPE_RESPONSE, res);
              return;
            }
            const editedRecipe = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Edited recipe ${editedRecipe.name}!`));
            const res: IEditRecipeResponse = {
              recipe: editedRecipe
            };
            socket.emit(EDIT_RECIPE_RESPONSE, res);
          });
        })
        .on(DELETE_RECIPE_REQUEST, (request: IDeleteRecipeRequest) => {
          console.info(chalk.green('Delete recipe request...'));
          if (!request || !request.recipeId) {
            const error = 'Invalid Id for request';
            console.info(chalk.red(error));
            const res: IDeleteRecipeResponse = {
              error
            };
            socket.emit(DELETE_RECIPE_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Delete recipe by Id request...'));
          const { recipeId } = request;
          RecipeModel.findOneAndDelete({ recipeId }, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IDeleteRecipeResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(DELETE_RECIPE_RESPONSE, res);
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              const res: IDeleteRecipeResponse = {
                error
              };
              socket.emit(DELETE_RECIPE_RESPONSE, res);
              return;
            }
            const deletedRecipe = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Deleted recipe ${deletedRecipe.name}!`));
            const res: IDeleteRecipeResponse = {
              recipe: deletedRecipe
            };
            socket.emit(DELETE_RECIPE_RESPONSE, res);
          });
        })
        .on(GET_RECIPES_REQUEST, () => {
          console.info(chalk.green('Get recipe request...'));
          let allRecipes: IRecipe[] = [];
          RecipeModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IGetRecipesResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(GET_RECIPES_RESPONSE, res);
              return;
            }
            allRecipes = docs.map((d, i) => databaseDocumentToRecipe(d, false));
            console.info(chalk.green('Got all recipes!'));
            const res: IGetRecipesResponse = {
              recipes: allRecipes
            };
            socket.emit(GET_RECIPES_RESPONSE, res);
          });
        })
        .on(GET_RECIPE_BY_ID_REQUEST, (request: IGetRecipeByIdRequest) => {
          if (!request || !request.recipeId) {
            const error = 'Invalid Id for request!';
            console.info(chalk.red(error));
            const res: IGetRecipesResponse = {
              error
            };
            socket.emit(GET_RECIPES_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Get recipe by Id request...'));
          const { recipeId } = request;
          RecipeModel.findOne({ recipeId }, null, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IGetRecipesResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(GET_RECIPES_RESPONSE, res);
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              const res: IGetRecipesResponse = {
                error
              };
              socket.emit(GET_RECIPES_RESPONSE, res);
              return;
            }
            const recipeById = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Got recipe ${recipeById.name}!`));
            const res: IGetRecipesResponse = {
              recipeId,
              recipes: [recipeById]
            };
            socket.emit(GET_RECIPES_RESPONSE, res);
          });
        });
      socket.on('disconnect', () => {
        console.info(chalk.cyan(`Disconnected ${socket.id}`));
      })
      this.socket = socket;
    });
    this.server.listen(port, () => {
      console.info(chalk.yellow(`Opened server at: localhost:${port} | ${address()}:${port}`));
    });
  }
}

export default Communications;
