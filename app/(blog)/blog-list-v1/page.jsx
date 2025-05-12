import dynamic from "next/dynamic";

import BlogList from "@/components/blog-meu-pages/blog-list-v1";

export const metadata = {
  title: "Blog List || JobHunt - Employment Marketplace",
  description: "JobHunt - Employment Marketplace",
};
const index = () => {
  return (
    <>
      <BlogList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
