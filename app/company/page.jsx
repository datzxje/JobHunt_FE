import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Companies || JobHunt - Employment Marketplace",
  description: "JobHunt - Employment Marketplace",
};

const CompanyPage = () => {
  // Redirect to company list page
  redirect("/company/list");
  
  return null;
};

export default dynamic(() => Promise.resolve(CompanyPage), { ssr: false }); 