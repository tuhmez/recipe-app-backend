import { IIngredient, IngredientUnit, IRecipe, IStep, RecipeDifficulty, StepType, TimeUnit } from "../common/types";
import { IRecipeDocument, } from "../database";

export function ingredientDocumentToRecipeIngredient(document: IIngredient): IIngredient {
  const ingredient: IIngredient = {
    name: document.name,
    measurement: document.measurement,
    units: document.units
  };
  console.log(ingredient);
  return ingredient;
}

export function stepDocumentToRecipeStep(document: IStep): IStep {
  return {
    stepNumber: document.stepNumber,
    description: document.description,
    time: document.time,
    timeUnit: document.timeUnit,
    stepType: document.stepType
  } as IStep;
}

export function databaseDocumentToRecipe(document: IRecipeDocument, index: number): IRecipe {
  return {
    recipeId: `${index + 1}`,
    name: document.name,
    type: document.type,
    images: [] as any[],
    linkToWebsite: document.linkToWebsite,
    ingredients: document.ingredients.map(i => ingredientDocumentToRecipeIngredient(i)),
    steps: document.steps.map(s => stepDocumentToRecipeStep(s)),
    difficulty: document.difficulty as RecipeDifficulty,
    keywords: document.keywords,
    favorited: document.favorited
  } as IRecipe;
}
