// lib/meal.ts
import { cache } from "react";
import sql from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "meals.db");
const db = sql(dbPath);

export type Meal = {
  id: number;
  slug: string;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
};

// synchronous cached versions (better-sqlite3 is sync)
export const getMeals = cache((): Meal[] => {
  return db.prepare("SELECT * FROM meals").all() as Meal[];
});

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug =?').get(slug);
}
// Accept undefined and return undefined early — avoid runtime exception
// export const getMeal = cache((slug?: string): Meal | undefined => {
//   if (!slug || typeof slug !== "string") return undefined;

//   const cleanedSlug = slug.trim().toLowerCase();
//   return db
//     .prepare("SELECT * FROM meals WHERE LOWER(slug) = ?")
//     .get(cleanedSlug) as Meal | undefined;
// });

// debug helper (temporary)
export const debugList = (): { dbPath: string; rows: { slug: string; title: string }[] } => {
  const rows = db.prepare("SELECT slug, title FROM meals").all() as { slug: string; title: string }[];
  return { dbPath, rows };
};
