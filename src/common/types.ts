export interface IRecipe {
  id: string;
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
  stepNumber: number;
  description: string;
  time: number;
  timeUnit: TimeUnit;
  stepType: StepType;
}

export enum TimeUnit {
  SECONDS = 'SECONDS',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS'
}

export enum StepType {
  BAKE = 'BAKE',
  BOIL = 'BOIL',
  BROIL = 'BROIL',
  COOK = 'COOK',
  CUT = 'CUT',
  CHOP = 'CHOP',
  DICE = 'DICE',
  FREEZE = 'FREEZE',
  FRY = 'FRY',
  GRILL = 'GRILL',
  JUICE = 'JUICE',
  MICROWAVE = 'MICROWAVE',
  MIX = 'MIX',
  NONE = 'NONE',
  POUR = 'POUR',
  PREPARE = 'PREPARE',
  ROAST = 'ROAST',
  SEASON = 'SEASON',
  SEPARATE = 'SEPARATE',
  SIMMER = 'SIMMER',
  SHRED = 'SHRED',
  STEW = 'STEW',
  STEAM = 'STEAM',
  STIR = 'STIR',
  TOP = 'TOP',
  WASH = 'WASH',
  ZEST = 'ZEST'
}

export enum RecipeDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}
