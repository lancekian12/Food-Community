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

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(" ").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving iamge failed");
    }
  });

  meal.image = `/images/${fileName}`;

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
  ).run(meal);
}
