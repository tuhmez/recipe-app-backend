import { IIngredient, IngredientUnit, IRecipe, IStep, RecipeDifficulty, RecipeType, TimeUnit } from '../../src/common/types';

export const expectedErrorMessage = {
  err: 'test err'
};

export const expectedIngredientsList: IIngredient[] = [
  {
    name: 'Chicken',
    measurement: 1,
    units: IngredientUnit.POUND
  },
  {
    name: 'Tortillas',
    measurement: 3,
    units: IngredientUnit.NONE
  },
  {
    name: 'Onion',
    measurement: 0.5,
    units: IngredientUnit.NONE
  }
];

export const expectedStepsList: IStep[] = [
  {
    description: 'Cook chicken',
    time: 20,
    timeUnit: TimeUnit.MINUTES,
  },
  {
    description: 'Shred chicken',
    time: 5,
    timeUnit: TimeUnit.MINUTES,
  }
];

export const validUUIDV4 = '582ec3ae-a0df-4efa-92c2-32939b556525';

export const expectedRecipe: IRecipe = {
  recipeId: validUUIDV4,
  name: 'Street Tacos',
  type: RecipeType.DINNER,
  images: [],
  linkToWebsite: 'https://cookingwithcocktailrings.com/2016-mexican-chicken-street-tacos/',
  ingredients: expectedIngredientsList,
  steps: expectedStepsList,
  difficulty: RecipeDifficulty.MEDIUM,
  keywords: [
    'tacos',
    'mexican',
    'chicken'
  ],
  favorited: true
};
