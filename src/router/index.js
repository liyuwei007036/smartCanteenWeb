/**
 * 配置vue-routers
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import origination from '@/pages/origination';
import employeeList from '@/pages/employeeList';
import roleList from '@/pages/roleList';
import roleAuth from '@/pages/roleAuth';
import rechargeList from '@/pages/rechargeList';
import consumeList from '@/pages/consumeList';
import cardList from '@/pages/cardList';
import index from '@/pages/index';
import login from '@/pages/login';
import home from '@/pages/home';
import error from '@/pages/error';
import error403 from '@/pages/error403';
// 使用插件, 用use
Vue.use(VueRouter); // 调用一个这个方法
const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/404',
            component: error,
            name: 'error',
            meta: {
                title: 'error',
            }
        },
        {
            path: '/error403',
            component: error403,
            name: 'error403',
            meta: {
                title: 'error403',
            }
        },
        {
            path: '/',
            component: index,
            name: 'index',
            auths: [],
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: home,
                    meta: {
                        title: '首页',
                        auths: []
                    }
                },
                {
                    path: '/origination',
                    component: origination,
                    name: 'origination',
                    meta: {
                        title: '组织结构',
                        auths: ['origination:view']
                    }
                },
                {
                    path: '/employeeList',
                    component: employeeList,
                    name: 'employeeList',
                    meta: {
                        title: '人员资料',
                        auths: ['employee']

                    }
                }, {
                    path: '/roleList',
                    component: roleList,
                    name: 'roleList',
                    meta: {
                        title: '角色管理',
                        auths: ['role']
                    }
                }, {
                    path: '/roleAuth',
                    component: roleAuth,
                    name: 'roleAuth',
                    meta: {
                        title: '角色授权',
                        auths: ['role:authorization']
                    }
                }, {
                    path: '/rechargeList',
                    component: rechargeList,
                    name: 'rechargeList',
                    meta: {
                        title: '充值记录',
                        auths: ['recharge:listlog'],
                    }
                }, {
                    path: '/cardList',
                    component: cardList,
                    name: 'cardList',
                    meta: {
                        title: '卡片管理',
                        auths: ['icCard'],
                    }
                }, {
                    path: '/consumeList',
                    component: consumeList,
                    name: 'consumeList',
                    meta: {
                        title: '消费记录',
                        auths: ['order:list'],
                    }
                },
            ],
        }, {
            path: "*", // 此处需特别注意置于最底部
            redirect: "/404"
        }

    ],
});

router.beforeEach((to, from, next) => {
    console.log(to, from)
    const hasAuth = function (needAuths, haveAuths) {
        if (needAuths === undefined || needAuths.length === 0) {
            return true
        } else {
            for (let i in needAuths) {
                if (haveAuths.includes(needAuths[i])) {
                    return true;
                }
            }
            return false;
        }
    }
    let $user
    try {
        $user = JSON.parse(sessionStorage.getItem('user'))
    } catch (e) {

    }
    let permissions = []
    if ($user) {
        permissions = $user.powers || [];
    }
    if (!hasAuth(to.meta.auths, permissions)) {
        //没有权限重定位到其他页面，往往是401页面
        next({replace: true, name: 'error'})
    }
    //权限校验通过,跳转至对应路由
    next();
})

export default router;
