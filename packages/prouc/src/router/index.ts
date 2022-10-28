import { createRouter, createWebHashHistory } from "vue-router";
import EditorPage from "@prouc/editor";

const routes = [
  { path: "/", component: EditorPage.Home },
  { path: "/preview", component: EditorPage.Preview },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
