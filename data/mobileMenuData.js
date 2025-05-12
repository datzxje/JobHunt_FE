module.exports = [
  {
    id: 1,
    name: "Home",
    routePath: "/",
    type: "link"
  },
  {
    id: 2,
    name: "Find Jobs",
    routePath: "/job-list-v5",
    type: "link"
  },
  {
    id: 3,
    label: "Job Single",
    items: [
      {
        name: "Job Single V1",
        routePath: "/job-single-v1/1",
      },
      {
        name: "Job Single V2",
        routePath: "/job-single-v2/2",
      },
      {
        name: "Job Single V3",
        routePath: "/job-single-v3/3",
      },
      {
        name: "Job Single V4",
        routePath: "/job-single-v4/4",
      },
      {
        name: "Job Single V5",
        routePath: "/job-single-v5/5",
      },
    ],
  },
  {
    id: 4,
    name: "Company",
    routePath: "/employers-list-v2",
    type: "link"
  },
  {
    id: 5,
    name: "Blog",
    routePath: "/blog-list-v1",
    type: "link"
  },
  {
    id: 6,
    name: "About",
    routePath: "/about",
    type: "link"
  },
  {
    id: 7,
    label: "Shop",
    items: [
      {
        name: "Shop List",
        routePath: "/shop/shop-list",
      },
      {
        name: "Shop Single",
        routePath: "/shop/shop-single/1",
      },
      {
        name: " Cart",
        routePath: "/shop/cart",
      },
      {
        name: "Checkout",
        routePath: "/shop/checkout",
      },
      {
        name: "Order Completed",
        routePath: "/shop/order-completed",
      },
      {
        name: "Login",
        routePath: "/login",
      },
      {
        name: "Register",
        routePath: "/register",
      },
    ],
  },
  {
    id: 8,
    label: "Dashboard",
    items: [
      {
        name: "Employers Dashboard",
        routePath: "/employers-dashboard/dashboard",
      }
    ],
  },
];
