import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/index'; // 引入路由
import axios from './api/index'; // 引入路由



Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app');
