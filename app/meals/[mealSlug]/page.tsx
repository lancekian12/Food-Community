import React from "react";

const MealDetailPage = async ({ params }) => {
  const { slug } = await params;
  return (
    <div>
      <h1>Meal Details</h1>
      <p>{slug}</p>
    </div>
  );
};

export default MealDetailPage;
