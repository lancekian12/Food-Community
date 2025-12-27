// lib/meal.ts
import { cache } from "react";
import sql from "better-sqlite3";
import path from "path";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

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

export type NewMeal = {
  title: string;
  summary: string;
  instructions: string;
  image: File;
  creator: string;
  creator_email: string;
  slug?: string;
};

export const getMeals = cache(async (): Promise<Meal[]> => {
  return db.prepare("SELECT * FROM meals").all() as Meal[];
});

export async function getMeal(slug?: unknown): Promise<Meal | undefined> {
  if (!slug || typeof slug !== "string") return undefined;

  // keep your original query — no changes to logic
  const row = db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug) as
    | Meal
    | undefined;

  return row;
}

export const debugList = cache(async () => {
  const rows = db.prepare("SELECT slug, title FROM meals").all() as {
    slug: string;
    title: string;
  }[];

  return {
    dbPath,
    rows,
  };
});

export async function saveMeal(meal: NewMeal): Promise<void> {
  const slug = slugify(meal.title, { lower: true });
  const sanitizedInstructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${slug}.${extension}`;

  const imagePath = `/images/${fileName}`;

  const bufferedImage = await meal.image.arrayBuffer();
  await fs.promises.writeFile(
    `public/images/${fileName}`,
    Buffer.from(bufferedImage)
  );

  const dbMeal = {
    title: meal.title,
    summary: meal.summary,
    instructions: sanitizedInstructions,
    creator: meal.creator,
    creator_email: meal.creator_email,
    image: imagePath,
    slug,
  };

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
    `
  ).run(dbMeal);
}