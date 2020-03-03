/**
 * 配置vue-routers
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import origination from '@/pages/origination';
import employeeList from '@/pages/employeeList';
import index from '@/pages/index';
import login from '@/pages/login';
import home from '@/pages/home';
// 使用插件, 用use
Vue.use(VueRouter); // 调用一个这个方法
const router = new VueRouter({
    mode: 'history',
    base: '/utils/',
    routes: [
        {
            path: '/',
            name: 'login',
            component: login,
        },
        {
            path: '/index',
            component: index,
            name: 'index',
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: home,
                    meta: {
                        title: '首页'
                    }
                },
                {
                    path: '/origination',
                    component: origination,
                    name: 'origination',
                    meta: {
                        title: '组织结构'
                    }
                },
                {
                    path: '/employeeList',
                    component: employeeList,
                    name: 'employeeList',
                  meta: {
                    title: '人员资料'
                  }
                },
            ],
        },

    ],
});

export default router;
