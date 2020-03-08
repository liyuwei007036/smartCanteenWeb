/**
 * 配置vue-routers
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import origination from '@/pages/origination';
import employeeList from '@/pages/employeeList';
import roleList from '@/pages/roleList';
import roleAuth from '@/pages/roleAuth';
import patchCard from '@/pages/patchCard';
import accountCancellation from '@/pages/accountCancellation';
import rechargeList from '@/pages/rechargeList';
import consumeList from '@/pages/consumeList';
import cardList from '@/pages/cardList';
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
                }, {
                    path: '/roleList',
                    component: roleList,
                    name: 'roleList',
                    meta: {
                        title: '角色管理'
                    }
                },{
                    path: '/roleAuth',
                    component: roleAuth,
                    name: 'roleAuth',
                    meta: {
                        title: '角色授权'
                    }
                },{
                    path: '/patchCard',
                    component: patchCard,
                    name: 'patchCard',
                    meta: {
                        title: '遗失补办'
                    }
                },{
                    path: '/accountCancellation',
                    component: accountCancellation,
                    name: 'accountCancellation',
                    meta: {
                        title: '销户退卡'
                    }
                },{
                    path: '/rechargeList',
                    component: rechargeList,
                    name: 'rechargeList',
                    meta: {
                        title: '充值记录'
                    }
                },{
                    path: '/cardList',
                    component: cardList,
                    name: 'cardList',
                    meta: {
                        title: '卡片管理'
                    }
                },{
                    path: '/consumeList',
                    component: consumeList,
                    name: 'consumeList',
                    meta: {
                        title: '消费记录'
                    }
                },
            ],
        },

    ],
});

export default router;
