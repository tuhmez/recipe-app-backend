import { v4 as uuidv4 } from 'uuid';
import { IIngredient, IngredientUnit, IRecipe, IStep, RecipeDifficulty, StepType, TimeUnit } from "../common/types";
import { IRecipeDocument, } from "../database";

export function ingredientDocumentToRecipeIngredient(document: IIngredient): IIngredient {
  return {
    name: document.name,
    measurement: document.measurement,
    units: document.units
  };
}

export function stepDocumentToRecipeStep(document: IStep): IStep {
  return {
    stepNumber: document.stepNumber,
    description: document.description,
    time: document.time,
    timeUnit: document.timeUnit,
    stepType: document.stepType
  };
}

export function databaseDocumentToRecipe(document: IRecipeDocument, isNew: boolean = false): IRecipe {
  return {
    recipeId: isNew ? uuidv4() : document.recipeId,
    name: document.name,
    type: document.type,
    images: [] as any[],
    linkToWebsite: document.linkToWebsite,
    ingredients: document.ingredients.map(i => ingredientDocumentToRecipeIngredient(i)),
    steps: document.steps.map(s => stepDocumentToRecipeStep(s)),
    difficulty: document.difficulty as RecipeDifficulty,
    keywords: document.keywords,
    favorited: document.favorited
  };
}
