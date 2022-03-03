export interface IRecipe {
  recipeId: string;
  name: string;
  type: RecipeType;
  images: string[];
  linkToWebsite: string;
  ingredients: IIngredient[];
  steps: IStep[];
  difficulty: RecipeDifficulty;
  keywords: string[];
  favorited: boolean;
}

export enum RecipeType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  APPETIZER = 'APPETIZER',
  SNACK = 'SNACK',
  DRINK = 'DRINK'
}

export interface IIngredient {
  name: string;
  measurement: number;
  units: IngredientUnit;
}

export enum IngredientUnit {
  BOTTLE = 'BOTTLE',
  CAN = 'CAN',
  CLOVE = 'CLOVE',
  CUP = 'CUP',
  GALLON = 'GALLON',
  NONE = 'NONE',
  OUNCE = 'OUNCE',
  PINCH = 'PINCH',
  PINT = 'PINT',
  POUND = 'POUND',
  QUART = 'QUART',
  SHOT = 'SHOT',
  TABLESPOON = 'TABLESPOON',
  TEASPOON = 'TEASPOON'
}

export interface IStep {
  description: string;
  time: number;
  timeUnit: TimeUnit;
}

export enum TimeUnit {
  SECONDS = 'SECONDS',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS'
}

export enum RecipeDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}
