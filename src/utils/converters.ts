import { v4 as uuidv4 } from 'uuid';
import { IIngredient, IIssue, IRecipe, IStep, RecipeDifficulty, TimeUnit } from "../common/types";
import { IIssueDocument, IRecipeDocument, } from "../database";

export function ingredientDocumentToRecipeIngredient(document: IIngredient): IIngredient {
  return {
    name: document.name,
    measurement: document.measurement,
    units: document.units
  };
}

export function stepDocumentToRecipeStep(document: IStep): IStep {
  return {
    description: document.description,
    time: document.time,
    timeUnit: document.timeUnit,
  };
}

export function databaseDocumentToRecipe(document: IRecipeDocument, isNew: boolean = false): IRecipe {
  return {
    recipeId: isNew ? uuidv4() : document.recipeId,
    name: document.name,
    type: document.type,
    images: document.images.map(i => Buffer.from(i, 'base64').toString()),
    linkToWebsite: document.linkToWebsite,
    ingredients: document.ingredients.map(i => ingredientDocumentToRecipeIngredient(i)),
    steps: document.steps.map(s => stepDocumentToRecipeStep(s)),
    difficulty: document.difficulty as RecipeDifficulty,
    keywords: document.keywords,
    favorited: document.favorited
  };
}

export function databaseDocumentToIssue(document: IIssueDocument, isNew: boolean = false): IIssue {
  return {
    issueId: isNew ? uuidv4() : document.issueId,
    name: document.name,
    description: document.description
  };
}
