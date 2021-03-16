import { Schema } from 'mongoose';
// import { findByDifficulty, findByFavorites, findByRecipeId, findOneOrCreate, findByName, findByType } from './recipes.statics';
// import {} from './recipes.methods';

const recipeTypeEnumArray = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'APPETIZER',
  'SNACK',
  'DRINK'
];

const ingredientUnitsEnumArray = [
  'BOTTLE',
  'CAN',
  'CLOVE',
  'CUP',
  'GALLON',
  'NONE',
  'OUNCE',
  'PINCH',
  'PINT',
  'POUND',
  'QUART',
  'SHOT',
  'TABLESPOON',
  'TEASPOON'
];

const stepTypeEnumArray = [
  'BAKE',
  'BOIL',
  'BROIL',
  'COOK',
  'CUT',
  'CHOP',
  'DICE',
  'FREEZE',
  'FRY',
  'GRILL',
  'JUICE',
  'MICROWAVE',
  'MIX',
  'POUR',
  'PREPARE',
  'ROAST',
  'SEASON',
  'SEPARATE',
  'SIMMER',
  'SHRED',
  'STEW',
  'STEAM',
  'STIR',
  'TOP',
  'WASH',
  'ZEST',
];

const difficultyEnumArray = [
  'EASY',
  'MEDIUM',
  'HARD'
];

const RecipeSchema = new Schema({
  recipeId: String,
  recipeName: String,
  type: {
    type: String,
    enum: recipeTypeEnumArray,
    default: recipeTypeEnumArray[0]
  },
  images: [{
    type: Buffer,
    contentType: String
  }],
  linkToWebsite: String,
  ingredients: [{
    name: String,
    measurement: Number,
    unit: {
      type: String,
      enum: ingredientUnitsEnumArray,
      defatul: ingredientUnitsEnumArray[0]
    }
  }],
  steps: [{
    stepNumber: Number,
    description: String,
    time: Number,
    stepType: {
      type: String,
      enum: stepTypeEnumArray,
      default: stepTypeEnumArray[0]
    }
  }],
  difficulty: {
    type: String,
    enum: difficultyEnumArray,
    default: difficultyEnumArray[0]
  },
  keywords: [{
    type: String
  }],
  favorited: Boolean
});

RecipeSchema.static('findByDifficulty', function(difficulty: string) { return this.find( {difficulty } ) });
RecipeSchema.static('findByFavorites', function(favorited: boolean) { return this.find({ favorited } ) });
RecipeSchema.static('findOneOrCreate', async function(recipeId: string) {
  const record = await this.findOne({ recipeId });
  if (record) {
    return record;
  } else {
    return this.create({ recipeId });
  }
});
RecipeSchema.static('findByName', function(recipeName: string) { return this.find( {recipeName } ) });
RecipeSchema.static('findByType', function(type: string) { return this.find( { type } ) });
RecipeSchema.static('findByRecipeId', function(recipeId: string) { return this.find( { recipeId } ) });

export default RecipeSchema;
