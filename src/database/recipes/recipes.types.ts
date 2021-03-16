import { Document, Model } from 'mongoose';

export interface IRecipe {
  recipeId: string;
  recipeName: string;
  type: string;
  images: Uint8Array[]
  linkToWebsite: string;
  ingredients: IRecipeIngredient[];
  steps: IRecipeStep[];
  difficulty: string;
  keywords: string[];
  favorited: boolean;
};

export interface IRecipeIngredient {
  name: string;
  measurement: number;
  unit: string;
}

export interface IRecipeStep {
  stepNumber: number;
  description: string;
  time: number;
  stepType: string;
}

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
      recipeName,
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
      recipeName: string,
      type: string,
      images: Uint8Array[],
      linkToWebsite: string,
      ingredients: [{ name: string, measurement: number, unit: string }],
      steps: [{ stepNumber: number, description: string, time: number, stepType: string}],
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
