import { IRecipe } from '../common/types';

// Add Recipe Interfaces
export interface IAddRecipeRequest extends IRecipe {}
export interface IAddRecipeResponse {
  recipe?: IRecipe;
  error?: string;
}

// Edit Recipe Interfaces
export interface IEditRecipeRequest extends IRecipe {}
export interface IEditRecipeResponse {
  recipe?: IRecipe;
  error?: string;
}

// Delete Recipe Interfaces
export interface IDeleteRecipeRequest {
  recipeId: string;
}
export interface IDeleteRecipeResponse {
  recipe?: IRecipe;
  error?: string;
}

// Get Recipe Interfaces
export interface IGetRecipeByIdRequest {
  recipeId: string;
}
export interface IGetRecipesResponse {
  recipeId?: string;
  recipes?: IRecipe[];
  error?: string;
}