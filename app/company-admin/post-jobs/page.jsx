import dynamic from "next/dynamic";
import PostJob from "@/components/dashboard-pages/company-admin/post-jobs";

export const metadata = {
  title: "Post Jobs || JobHunt - Company Admin Dashboard",
  description: "JobHunt - Company Admin Dashboard - Post New Jobs",
};

const index = () => {
  return (
    <>
      <PostJob />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 