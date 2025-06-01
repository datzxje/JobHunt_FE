import dynamic from "next/dynamic";
import TeamMembersPage from "@/components/dashboard-pages/company-admin/team-members";

export const metadata = {
  title: "Team Members Management || JobHunt - Company Admin",
  description: "Manage company team members, roles, and permissions",
};

const index = () => {
  return (
    <>
      <TeamMembersPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false }); 