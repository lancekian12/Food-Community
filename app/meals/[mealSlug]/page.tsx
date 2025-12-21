import React from "react";

type MealDetailPageProps = {
  params: {
    slug: string;
  };
};

const MealDetailPage = async ({ params }: MealDetailPageProps) => {
  const { slug } = params;

  return (
    <div>
      <h1>Meal Details</h1>
      <p>{slug}</p>
    </div>
  );
};

export default MealDetailPage;
