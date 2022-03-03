import { Document, Model } from 'mongoose';
import { IRecipe } from '../../common/types';

export interface IRecipeDocument extends IRecipe, Document {};

export interface IRecipeModel extends Model<IRecipeDocument> {
  findByDifficulty: (
    this: IRecipeModel,
    difficulty: string
  ) => Promise<IRecipeDocument[]>;
  findByFavorites: (
    this: IRecipeModel,
    favorited: boolean
  ) => Promise<IRecipeDocument[]>;
  findByRecipeId: (
    this: IRecipeModel,
    recipeId: string
  ) => Promise<IRecipeDocument[]>;
  findOneOrCreate: (
    this: IRecipeModel,
    {
      recipeId,
      name,
      type,
      images,
      linkToWebsite,
      ingredients,
      steps,
      difficulty,
      keywords,
      favorited
    }: {
      recipeId: string,
      name: string,
      type: string,
      images: Uint8Array[],
      linkToWebsite: string,
      ingredients: [{ name: string, measurement: number, units: string }],
      steps: [{ description: string, time: number, timeUnit: string }],
      difficulty: string,
      keywords: string[],
      favorited: boolean,
    }
  ) => Promise<IRecipeDocument>;
  findByName: (
    this: IRecipeModel,
    recipeName: string
  ) => Promise<IRecipeDocument[]>;
  findByType: (
    this: IRecipeModel,
    type: string
  ) => Promise<IRecipeDocument[]>;
};
