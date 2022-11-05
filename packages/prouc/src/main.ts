import "@/style.css";
import "@prouc/editor/dist/style.css";

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import { proucEditor } from "@/components";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(proucEditor);
app.mount("#app");
