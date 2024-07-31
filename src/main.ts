import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./infra/router";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { InitApi } from "./infra/utils/init";

const i18n = createI18n({
  locale: navigator.language.split("-")[0],
  fallbackLocale: "en",
  warnHtmlInMessage: "error",
  sharedMessages: true,
  inheritLocale: true,
  legacy: false,
});

InitApi.setApiUrl();
createApp(App).use(i18n).use(router).use(createPinia()).mount("#app");
