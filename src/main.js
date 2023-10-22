import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles.scss";

import { createPinia } from "pinia";
import "ant-design-vue/es/message/style/css";

createApp(App).use(router).use(createPinia()).mount("#app");
