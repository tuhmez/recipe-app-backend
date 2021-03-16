import { model } from 'mongoose';
import { IRecipeDocument } from './recipes.types';
import RecipeSchema from './recipes.schema';

export const RecipeModel = model<IRecipeDocument>('recipe', RecipeSchema);
