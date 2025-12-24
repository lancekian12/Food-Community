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

export const getMeals = cache(async (): Promise<Meal[]> => {
  return db.prepare("SELECT * FROM meals").all() as Meal[];
});

export async function getMeal(slug?: unknown): Promise<Meal | undefined> {
  if (!slug || typeof slug !== "string") return undefined;

  // keep your original query — no changes to logic
  const row = db
    .prepare("SELECT * FROM meals WHERE slug = ?")
    .get(slug) as Meal | undefined;

  return row;
}

// export const getMeal = cache(
//   async (slug?: string): Promise<Meal | undefined> => {
//     if (!slug || typeof slug !== "string") return undefined;

//     const cleaned = slug.trim().toLowerCase();

//     return db
//       .prepare("SELECT * FROM meals WHERE LOWER(slug) = ?")
//       .get(cleaned) as Meal | undefined;
//   }
// );

export const debugList = cache(async () => {
  const rows = db
    .prepare("SELECT slug, title FROM meals")
    .all() as { slug: string; title: string }[];

  return {
    dbPath,
    rows,
  };
});
