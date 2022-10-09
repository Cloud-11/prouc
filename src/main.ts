import { createApp } from "vue";
import "./style.css";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus);
app.use(pinia);
app.mount("#app");
