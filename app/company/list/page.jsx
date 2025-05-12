import dynamic from "next/dynamic";
import EmployersList from "@/components/employers-listing-pages/employers-list-v2";

export const metadata = {
  title: "Companies List || JobHunt - Employment Marketplace",
  description: "JobHunt - Employment Marketplace",
};

const index = () => {
  return (
    <>
      <EmployersList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 