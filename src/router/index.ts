import Home from "@/pages/home.vue";
import Preview from "@/pages/preview";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/preview", component: Preview },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
