import dynamic from "next/dynamic";
import CompanyProfilePage from "@/components/dashboard-pages/company-admin/company-profile";

export const metadata = {
  title: "Company Profile Management || JobHunt - Company Admin",
  description: "Manage company profile information, social networks, and contact details",
};

const index = () => {
  return (
    <>
      <CompanyProfilePage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 