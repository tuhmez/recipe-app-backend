import { IRecipeDocument, IRecipeModel } from './recipes.types';

// export async function findOneOrCreate(
//   this: IRecipeModel,
//   recipeId: string
// ): Promise<IRecipeDocument> {
//   const record = await this.findOne({ recipeId });
//   if (record) {
//     return record;
//   } else {
//     return this.create({ recipeId });
//   }
// };

// export async function findByRecipeId(
//   this: IRecipeModel,
//   id?: string
// ): Promise<IRecipeDocument[]> {
//   return this.find({ id });
// };

// export async function findByName(
//   this: IRecipeModel,
//   recipeName?: string
// ): Promise<IRecipeDocument[]> {
//   return this.find({ recipeName });
// };

// export async function findByType(
//   this: IRecipeModel,
//   type?: string
// ): Promise<IRecipeDocument[]> {
//   return this.find({ type });
// }

// export async function findByFavorites(
//   this: IRecipeModel,
//   favorited?: boolean
// ): Promise<IRecipeDocument[]> {
//   return this.find({ favorited });
// }

// export async function findByDifficulty(
//   this: IRecipeModel,
//   difficulty?: string
// ): Promise<IRecipeDocument[]> {
//   return this.find({ difficulty });
// };
