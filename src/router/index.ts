import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import ExternalApi from "../views/ExternalApi.vue";
import {Auth0} from "@/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: Auth0.routeGuard
  },
  {
    path: "/external-api",
    component: ExternalApi,
    beforeEnter: Auth0.routeGuard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
