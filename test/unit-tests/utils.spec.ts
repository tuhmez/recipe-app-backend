import { validate as uuidValidate } from 'uuid';
import { IRecipeDocument, RecipeModel } from '../../src/database';
import { exampleRecipe } from '../../src/common/example';
import {
  ingredientDocumentToRecipeIngredient,
  stepDocumentToRecipeStep,
  databaseDocumentToRecipe
} from '../../src/utils/converters';
import { errorMessageCreator } from '../../src/utils/error';
import { IIngredient } from '../../src/common/types';

import {
  expectedErrorMessage,
  expectedIngredientsList,
  expectedStepsList,
  expectedRecipe,
  validUUIDV4
} from '../resources/expected';

describe('errorMessageCreator', () => {
  test('returns err object', (done) => {
    const err = 'test err';
    const errorMessage = errorMessageCreator(err);
    expect(errorMessage).toStrictEqual(expectedErrorMessage);
    done();
  });
});

describe('converters', () => {
  let recipeModel: IRecipeDocument;
  beforeAll((done) => {
    recipeModel = new RecipeModel({ ...exampleRecipe, recipeId: validUUIDV4 });
    done();
  });

  test('ingredient converter', (done) => {
    const conversion = recipeModel.ingredients.map(i => ingredientDocumentToRecipeIngredient(i));
    expect(conversion).toStrictEqual(expectedIngredientsList);
    done();
  });

  test('step converter', (done) => {
    const conversion = recipeModel.steps.map(s => stepDocumentToRecipeStep(s));
    expect(conversion).toStrictEqual(expectedStepsList);
    done();
  });

  test('whole document converter', (done) => {
    const conversion = databaseDocumentToRecipe(recipeModel);
    expect(conversion).toStrictEqual(expectedRecipe);
    done();
  });

  test('new recipe uuid generation', (done) => {
    const conversion = databaseDocumentToRecipe(recipeModel, true);
    expect(uuidValidate(conversion.recipeId)).toBe(true);
    done();
  });
});
