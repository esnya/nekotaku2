import Vue, { ComponentOptions } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import 'moment/locale/ja';

new Vue({
  router,
  vuetify,
  render: h => h(App),
} as ComponentOptions<Vue>).$mount('#app');
