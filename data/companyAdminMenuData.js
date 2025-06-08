const companyAdminMenuData = [
  {
    id: 1,
    name: "Company Profile", 
    icon: "la-building",
    routePath: "/company-admin/company-profile",
    active: "",
  },
  {
    id: 2,
    name: "Join Requests",
    icon: "la-user-plus",
    routePath: "/company-admin/join-requests",
    active: "",
    // badge will be dynamically set from context
  },
  {
    id: 3,
    name: "Team Members",
    icon: "la-users",
    routePath: "/company-admin/team-members",
    active: "",
  },
  {
    id: 4,
    name: "Company Jobs",
    icon: "la-briefcase",
    routePath: "/company-admin/company-jobs",
    active: "",
  },
  {
    id: 5,
    name: "Back to Employer",
    icon: "la-arrow-left",
    routePath: "/employers-dashboard/dashboard",
    active: "",
  },
  {
    id: 6,
    name: "Logout",
    icon: "la-sign-out",
    routePath: "/",
    active: "",
  },
];

export default companyAdminMenuData; 