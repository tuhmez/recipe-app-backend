import { Server, createServer } from 'https';
import fs from 'fs';
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
  GET_ISSUE_REQUEST,
  DELETE_ISSUE_REQUEST,
  GET_ISSUE_BY_ID_REQUEST,
  ADD_ISSUE_RESPONSE,
  DELETE_ISSUE_RESPONSE,
  GET_ISSUE_RESPONSE,
  ADD_ISSUE_REQUEST,
} from './constants';
import {
  IAddIssueRequest,
  IAddIssueResponse,
  IAddRecipeRequest,
  IAddRecipeResponse,
  IEditRecipeRequest,
  IEditRecipeResponse,
  IDeleteIssueRequest,
  IDeleteIssueResponse,
  IDeleteRecipeRequest,
  IDeleteRecipeResponse,
  IGetIssueByIdRequest,
  IGetRecipeByIdRequest,
  IGetIssueResponse,
  IGetRecipesResponse,
} from './interfaces';
import { IIssue, IRecipe } from "../common/types";
import { IssueModel, RecipeModel } from "../database";
import { databaseDocumentToIssue, databaseDocumentToRecipe } from "../utils/converters";

export class Communications {
  public server: Server;
  public io: SocketServer;
  public socket: Socket | null = null;

  constructor(port: number) {
    const app = express();
    let options = {
      key: fs.readFileSync(`${process.env.NODE_ENV === 'prod' ? 'dist' : 'src'}/certs/file.pem`),
      cert: fs.readFileSync(`${process.env.NODE_ENV === 'prod' ? 'dist' : 'src'}/certs/file.crt`)
    };
    this.server = createServer(options, app);
    this.io = new SocketServer(this.server, { cors: { origin: '*' }, maxHttpBufferSize: 1e8, pingTimeout: 60000 });

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
            allRecipes = docs.map(d => databaseDocumentToRecipe(d, false));
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
        })
        .on(ADD_ISSUE_REQUEST, (request: IAddIssueRequest) => {
          if (!request) {
            const error = 'Invalid issue request!';
            console.info(chalk.red(error));
            const res: IAddIssueResponse = {
              error
            };
            socket.emit(ADD_ISSUE_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Add issue request...'));
          IssueModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IAddIssueResponse = {
                error: JSON.stringify(err)
              }
              socket.emit(ADD_ISSUE_RESPONSE, res);
              return;
            }
            request.issueId = uuidv4();
            new IssueModel(request)
              .save()
              .then(
                (doc) => {
                  const newIssue = databaseDocumentToIssue(doc, false);
                  console.info(chalk.green(`Added issue ${newIssue.name}!`));
                  const res: IAddIssueResponse = {
                    issue: newIssue
                  };
                  socket.emit(ADD_ISSUE_RESPONSE, res);
                },
                (err) => {
                  console.info(chalk.red(err));
                  const res: IAddIssueResponse = {
                    error: JSON.stringify(err)
                  };
                  socket.emit(ADD_ISSUE_RESPONSE, res);
                }
              );
          });
        })
        .on(DELETE_ISSUE_REQUEST, (request: IDeleteIssueRequest) => {
          console.info(chalk.green('Delete issue request...'));
          if (!request || !request.issueId) {
            const error = 'Invalid Id for request';
            console.info(chalk.red(error));
            const res: IDeleteIssueResponse = {
              error
            };
            socket.emit(DELETE_ISSUE_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Delete recipe by Id request...'));
          const { issueId } = request;
          IssueModel.findOneAndDelete({ issueId }, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IDeleteIssueResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(DELETE_ISSUE_RESPONSE, res);
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${issueId}`;
              console.info(chalk.red(error));
              const res: IDeleteIssueResponse = {
                error
              };
              socket.emit(DELETE_ISSUE_RESPONSE, res);
              return;
            }
            const deletedIssue = databaseDocumentToIssue(doc, false);
            console.info(chalk.green(`Deleted recipe ${deletedIssue.name}!`));
            const res: IDeleteIssueResponse = {
              issue: deletedIssue
            };
            socket.emit(DELETE_ISSUE_RESPONSE, res);
          });
        })
        .on(GET_ISSUE_REQUEST, () => {
          console.info(chalk.green('Get issue request...'));
          let allIssues: IIssue[] = [];
          IssueModel.find({}, (err, docs) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IGetIssueResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(GET_ISSUE_RESPONSE, res);
              return;
            }
            allIssues = docs.map(d => databaseDocumentToIssue(d, false));
            console.info(chalk.green('Got all issues!'));
            const res: IGetIssueResponse = {
              issues: allIssues
            };
            socket.emit(GET_ISSUE_RESPONSE, res);
          });
        })
        .on(GET_ISSUE_BY_ID_REQUEST, (request: IGetIssueByIdRequest) => {
          if (!request || !request.issueId) {
            const error = 'Invalid Id for request!';
            console.info(chalk.red(error));
            const res: IGetIssueResponse = {
              error
            };
            socket.emit(GET_ISSUE_RESPONSE, res);
            return;
          }
          console.info(chalk.green('Get recipe by Id request...'));
          const { issueId } = request;
          IssueModel.findOne({ issueId }, null, null, (err, doc) => {
            if (err) {
              console.info(chalk.red(err));
              const res: IGetIssueResponse = {
                error: JSON.stringify(err)
              };
              socket.emit(GET_ISSUE_RESPONSE, res);
              return;
            }
            if (!doc) {
              const error = `Couldn\'t find recipe of Id: ${issueId}`;
              console.info(chalk.red(error));
              const res: IGetIssueResponse = {
                error
              };
              socket.emit(GET_ISSUE_RESPONSE, res);
              return;
            }
            const issueById = databaseDocumentToIssue(doc, false);
            console.info(chalk.green(`Got recipe ${issueById.name}!`));
            const res: IGetIssueResponse = {
              issueId,
              issues: [issueById]
            };
            socket.emit(GET_ISSUE_RESPONSE, res);
          });
        });
      socket.on('disconnect', (reason: string) => {
        console.info(chalk.cyan(`Disconnected ${socket.id} | ${reason}`));
      })
      this.socket = socket;
    });
    this.server.listen(port, () => {
      console.info(chalk.yellow(`Opened server at: localhost:${port} | ${address()}:${port}`));
    });
  }
}

export default Communications;
