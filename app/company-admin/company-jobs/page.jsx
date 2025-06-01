import dynamic from "next/dynamic";
import CompanyJobsPage from "@/components/dashboard-pages/company-admin/company-jobs";

export const metadata = {
  title: "Company Jobs Overview || JobHunt - Company Admin",
  description: "View all company job listings and applications overview",
};

const index = () => {
  return (
    <>
      <CompanyJobsPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 