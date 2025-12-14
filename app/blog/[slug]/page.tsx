import React from "react";

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
  }) => {
  const {slug} = await params
  return (
    <div>
      <h1>Blog Post</h1>
      <p>{slug}</p>
    </div>
  );
};

export default BlogPostPage;
