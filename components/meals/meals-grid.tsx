import React from "react";
import classes from "./meal-grid.module.css";
import MealItem from "./meal-item";

// Define the meal type
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

type MealsGridProps = {
  meals: Meal[];
};

const MealsGrid: React.FC<MealsGridProps> = ({ meals }) => {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
};

export default MealsGrid;
