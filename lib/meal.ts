import { cache } from "react";
import sql from "better-sqlite3";

const db = sql("meals.db");

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

// Wrap in cache for memoization
export const getMeals = cache(async (): Promise<Meal[]> => {
  await new Promise((r) => setTimeout(r, 2000));
  return db.prepare("SELECT * FROM meals").all() as Meal[];
});
