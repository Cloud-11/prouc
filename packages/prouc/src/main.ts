import "@/style.css";
import "@prouc/editor/dist/style.css";

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import Editor from "@prouc/editor";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Editor);

app.mount("#app");
