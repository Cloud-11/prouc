import "./style.css";
import "element-plus/dist/index.css";
import "@icon-park/vue-next/styles/index.css";
import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import VueForm from "@lljj/vue3-form-element";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);
app.component("VueForm", VueForm);

app.mount("#app");
