import { Server, Socket } from "socket.io";
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
  GET_RECIPE_BY_ID_RESPONSE,
  ERROR,
  PING,
  PONG,
} from './constants';
import { IRecipe } from "../common/types";
import { RecipeModel } from "../database";
import { databaseDocumentToRecipe } from "../utils/converters";
import { errorMessageCreator } from "../utils/error";

interface IRecipeByIdRequest {
  recipeId: string;
}

interface IUpdateRecipeRequest {
  recipeId: string;
  recipe: IRecipe;
}

export class Communications {
  public io: Server;
  public socket: Socket | null = null;

  constructor(port: number) {
    this.io = new Server(port);

    console.info(chalk.yellow(`Opened server at: localhost:${port} | ${address()}:${port}`));

    this.io.on('connect', (socket) => {
      console.info(chalk.cyan(`Connected ${socket.id}`));
      socket
        .on(PING, () => {
          socket.emit(PONG, { status: 'OK' });
        })
        .on(ADD_RECIPE_REQUEST, (request: IRecipe) => {
          if (!request) {
            const err = 'Invalid recipe request!';
            console.info(chalk.red(err));
            socket.emit(ERROR, errorMessageCreator(err));
            return;
          }
          console.info(chalk.green('Add recipe request...'));
          RecipeModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              return;
            }
            request.recipeId = uuidv4();
            new RecipeModel(request)
              .save()
              .then(
              (doc) => {
                const newRecipe = databaseDocumentToRecipe(doc, false);
                console.info(chalk.green(`Added recipe ${newRecipe.name}!`));
                socket.emit(ADD_RECIPE_RESPONSE, newRecipe);
              },
              (err) => {
                console.info(chalk.red(err));
                socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              }
            );
          });
        })
        .on(EDIT_RECIPE_REQUEST, (request: IUpdateRecipeRequest) => {
          const { recipeId, recipe } = request;
          console.info(chalk.green('Edit recipe request...'));
          RecipeModel.findOneAndUpdate({ recipeId }, recipe, { new: true }, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              socket.emit(ERROR, errorMessageCreator(error));
              return;
            }
            const editedRecipe = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Edited recipe ${editedRecipe.name}!`));
            socket.emit(EDIT_RECIPE_RESPONSE, editedRecipe);
          });
        })
        .on(DELETE_RECIPE_REQUEST, (request: IRecipeByIdRequest) => {
          console.info(chalk.green('Delete recipe request...'));
          if (!request || !request.recipeId) {
            const err = 'Invalid Id for request';
            console.info(chalk.red(err));
            socket.emit(ERROR, errorMessageCreator(err));
            return;
          }
          console.info(chalk.green('Delete recipe by Id request...'));
          const { recipeId } = request;
          RecipeModel.findOneAndDelete({ recipeId }, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              socket.emit(ERROR, errorMessageCreator(error));
              return;
            }
            const deletedRecipe = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Deleted recipe ${deletedRecipe.name}!`));
            socket.emit(DELETE_RECIPE_RESPONSE, deletedRecipe);
          });
        })
        .on(GET_RECIPES_REQUEST, () => {
          console.info(chalk.green('Get recipe request...'));
          let allRecipes: IRecipe[] = [];
          RecipeModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              return;
            }
            allRecipes = docs.map((d, i) => databaseDocumentToRecipe(d, false));
            console.info(chalk.green('Got all recipes!'));
            socket.emit(GET_RECIPES_RESPONSE, allRecipes);
          });
        })
        .on(GET_RECIPE_BY_ID_REQUEST, (request: IRecipeByIdRequest) => {
          if (!request || !request.recipeId) {
            const err = 'Invalid Id for request!';
            console.info(chalk.red(err));
            socket.emit(ERROR, errorMessageCreator(err));
            return;
          }
          console.info(chalk.green('Get recipe by Id request...'));
          const { recipeId } = request;
          RecipeModel.findOne({ recipeId }, null, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              socket.emit(ERROR, errorMessageCreator(JSON.stringify(err)));
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${recipeId}`;
              console.info(chalk.red(error));
              socket.emit(ERROR, errorMessageCreator(error));
              return;
            }
            const recipeById = databaseDocumentToRecipe(doc, false);
            console.info(chalk.green(`Got recipe ${recipeById.name}!`));
            socket.emit(GET_RECIPE_BY_ID_RESPONSE, recipeById);
          });
        });
      socket.on('disconnect', () => {
        console.info(chalk.cyan(`Disconnected ${socket.id}`));
      })
      this.socket = socket;
    });
  }
}

export default Communications;
