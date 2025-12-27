import Image from "next/image";
import { getMeal } from "@/lib/meal";
import classes from "./page.module.css";
import { notFound } from "next/navigation";
import type { Meal } from "@/lib/meal";

type ParamsShape = { mealSlug: string };

// allow params to be either the object or a promise (so `await params` works)
type Props = {
  params: ParamsShape | Promise<ParamsShape>;
};

export async function generateMetadata({ params }: Props) {
  const { mealSlug } = (await params) as ParamsShape;
  const meal: Meal | undefined = await getMeal(mealSlug);

  if (!mealSlug) {
    notFound();
  }
  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailPage({ params }: Props) {
  const { mealSlug } = (await params) as ParamsShape;

  const meal: Meal | undefined = await getMeal(mealSlug);

  if (!meal) {
    notFound();
  }

  const instructionsHtml = meal.instructions
    ? meal.instructions.replace(/\n/g, "<br />")
    : "";

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>

        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>

      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: instructionsHtml }}
        />
      </main>
    </>
  );
}
