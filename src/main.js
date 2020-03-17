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
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ?
                (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app');
