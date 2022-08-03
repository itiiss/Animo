import App from "@/App.vue";
import { createApp as creat } from "vue";
import "@/styles/index.css";
import { router } from "@/modules/router";
import { i18n } from "./modules/i18n";
import { pinia } from "./modules/pinia";
import { createHead } from "@vueuse/head";

export const createApp = creat(App)
  .use(router)
  .use(pinia)
  .use(createHead())
  .use(i18n)
  .mount("#app");
