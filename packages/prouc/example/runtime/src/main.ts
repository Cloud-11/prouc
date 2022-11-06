import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { elementUi } from "@prouc/ui";

const app = createApp(App);
app.use(elementUi);
app.mount("#app");
