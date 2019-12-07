import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../layout/Index/Index";
import Home from "../views/Home/Home";
import Department from "../views/sys/Department/Department";
import User from "../views/sys/User/User";
import Role from "../views/sys/Role/Role";
import Menu from "../views/sys/Menu/Menu";
import NotFound from "../views/NotFound";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Index,
    children: [
      {
        path: "/home",
        component: Home
      },
      {
        path: "/sys/department",
        component: Department
      },
      {
        path: "/sys/user",
        component: User
      },
      {
        path: "/sys/role",
        component: Role
      },
      {
        path: "/sys/menu",
        component: Menu
      },
      {
        path: "/404",
        component: NotFound
      }
    ]
  },
  {
    path: "*",
    redirect: { path: "/404" }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
