"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meal";

type ShareMealState = {
  message?: string;
};

type Meal = {
  title: string;
  summary: string;
  instructions: string;
  image: File;
  creator: string;
  creator_email: string;
};

function isInvalidText(text: unknown): boolean {
  return typeof text !== "string" || text.trim().length === 0;
}
export async function shareMeal(
  _prevState: ShareMealState,
  formData: FormData
): Promise<ShareMealState> {
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return { message: "Invalid image file" };
  }

  const meal: Meal = {
    title: formData.get("title")?.toString() ?? "",
    summary: formData.get("summary")?.toString() ?? "",
    instructions: formData.get("instructions")?.toString() ?? "",
    image,
    creator: formData.get("name")?.toString() ?? "",
    creator_email: formData.get("email")?.toString() ?? "",
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    !meal.creator_email.includes("@")
  ) {
    return { message: "Invalid input" };
  }

  await saveMeal(meal);

  // ✅ Return state FIRST (type-safe)
  const result: ShareMealState = {};
  redirect("/meals");
  return result;
}