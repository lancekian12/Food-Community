import React from "react";

const page = async ({ params }) => {
  const { slug } = await params;
  return (
    <div>
      <p>{slug}</p>
    </div>
  );
};

export default page;
