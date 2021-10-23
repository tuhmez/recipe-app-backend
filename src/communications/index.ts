import { Server, Socket } from "socket.io";
import chalk from 'chalk';
import { address } from 'ip';
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
  GET_RECIPE_BY_ID_RESPONSE
} from '../communications';

export class Communications {
  public io: Server;
  public socket: Socket | null = null;

  constructor(port: number) {
    this.io = new Server(port);

    console.info(chalk.yellow(`Opened server at: localhost:${port} | ${address()}:${port}`));

    this.io.on('connect', (socket) => {
      console.info(chalk.cyan(`Connected ${socket.id}`));
      socket
        .on(ADD_RECIPE_REQUEST, () => {
          console.info(chalk.green('Add recipe request...'))
          // add recipe
          // emit response
          // console.info(chalk.green(`Added recipe ${request.name}!`))
          // socket.emit(ADD_RECIPE_RESPONSE, newRecipe);
        })
        .on(EDIT_RECIPE_REQUEST, () => {
          console.info(chalk.green('Edit recipe request...'))
          // edit recipe
          // emit response
          // console.info(chalk.green(`Edited recipe ${request.name}!`))
          // socket.emit(EDIT_RECIPE_RESPONSE, modifiedRecipe);
        })
        .on(DELETE_RECIPE_REQUEST, () => {
            console.info(chalk.green('Delete recipe request...'));
          // delete recipe, only by id
          // emit response
          // console.info(chalk.green(`Deleted recipe ${request.name}!`))
          // socket.emit(DELETE_RECIPE_RESPONSE, deletedRecipe);
        })
        .on(GET_RECIPES_REQUEST, () => {
          console.info(chalk.green('Get recipe request...'));
          // get all recipes
          // emit response
          // console.info(chalk.green('Got all recipes!'));
          // socket.emit(GET_RECIPES_RESPONSE, allRecipes);
        })
        .on(GET_RECIPE_BY_ID_REQUEST, () => {
          console.info(chalk.green('Get recipe by Id request...'));
          // get recipe by id
          // emit response
          // console.info(chalk.green(`Got recipe ${recipe.name}!`));
          // socket.emit(GET_RECIPE_BY_ID_RESPONSE, recipeById);
        });
      socket.on('disconnect', () => {
        console.info(chalk.cyan(`Disconnected ${socket.id}`));
      })
      this.socket = socket;
    });
  }
}

export default Communications;

export {
  ADD_RECIPE_REQUEST,
  ADD_RECIPE_RESPONSE,
  EDIT_RECIPE_REQUEST,
  EDIT_RECIPE_RESPONSE,
  DELETE_RECIPE_REQUEST,
  DELETE_RECIPE_RESPONSE,
  GET_RECIPES_REQUEST,
  GET_RECIPES_RESPONSE,
  GET_RECIPE_BY_ID_REQUEST,
  GET_RECIPE_BY_ID_RESPONSE
} from './constants';
