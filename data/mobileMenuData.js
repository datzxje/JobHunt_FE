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
    id: 4,
    name: "Company",
    routePath: "/company/list",
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
