import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/index'; // 引入路由
import axios from './api/index'; // 引入路由
import {aclDirective} from './api/acl'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.$http = axios
Vue.prototype.$user = {
    id: 0,
    account: '',
    name: '',
    powers: []
}
Vue.prototype.$ViewportSize = document.documentElement.clientHeight;
//main.js
Vue.directive('acl', aclDirective); //全局注册指令

new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app');
