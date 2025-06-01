import dynamic from "next/dynamic";
import JoinRequestsPage from "@/components/dashboard-pages/company-admin/join-requests";

export const metadata = {
  title: "Join Requests Management || JobHunt - Company Admin",
  description: "Manage company join requests - approve or reject member requests",
};

const index = () => {
  return (
    <>
      <JoinRequestsPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 