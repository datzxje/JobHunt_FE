import dynamic from "next/dynamic";
import JobList from "@/components/job-listing-pages/job-list-v5";

export const metadata = {
  title: "Job List|| JobHunt - Employment Marketplace",
  description: "JobHunt - Employment Marketplace",
};

const index = () => {
  return (
    <>
      <JobList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
