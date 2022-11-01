import { createRouter, createWebHashHistory } from "vue-router";
import {Home, Preview, PreviewMode,} from "@prouc/editor";

const routes = [
  { path: "/", component: Home },
  { path: "/preview", component: Preview },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
//设置预览路由方式
//预览按钮触发后执行
PreviewMode({ mode: "newWindow", router, path: "/preview" });
export { router };
