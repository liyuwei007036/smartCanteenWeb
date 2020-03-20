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
import rechargeDeduction from '@/pages/rechargeDeduction';
import lostAndFound from '@/pages/lostAndFound';
import consumerStatistics from '@/pages/consumerStatistics';
import loginLog from '@/pages/loginLog';
import operateLog from '@/pages/operateLog';
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
            path: '/403',
            name: 'error403',
            component: error403,
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
                    path: '/rechargeDeduction',
                    component: rechargeDeduction,
                    name: 'rechargeDeduction',
                    meta: {
                        title: '充值补扣',
                        auths: ['icCard'],
                    }
                }, {
                    path: '/lostAndFound',
                    component: lostAndFound,
                    name: 'lostAndFound',
                    meta: {
                        title: '遗失补办',
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
                },{
                    path: '/consumerStatistics',
                    component: consumerStatistics,
                    name: 'consumerStatistics',
                    meta: {
                        title: '消费统计',
                        auths: [],
                    }
                },{
                    path: '/operateLog',
                    component: operateLog,
                    name: 'operateLog',
                    meta: {
                        title: '操作日志',
                        auths: ['log:operation'],
                    }
                },{
                    path: '/loginLog',
                    component: loginLog,
                    name: 'loginLog',
                    meta: {
                        title: '登录日志',
                        auths: ['log:login'],
                    }
                },
            ],
        },
        {
            path: "*",
            component: error,
            name: '404',
        }
    ],
});

router.beforeEach((to, from, next) => {
    // localStorage.clear();
    if (from.name !== 'null' && from.name != null) {
        localStorage.clear();
    }
    if (to.name === 'login') {
        next();
    } else {
        let $user
        try {
            $user = JSON.parse(sessionStorage.getItem('user'))
        } catch (e) {

        }
        if ($user && $user.id === 1){
            next();
            return;
        }
        let permissions = []
        if ($user) {
            permissions = $user.powers || [];
        } else {
            next({replace: true, name: 'login'})
            next();
            return
        }
        if (!hasAuth(to.meta.auths, permissions)) {
            //没有权限重定位到其他页面，往往是401页面
            router.push({name: 'error403'})
        }
        //权限校验通过,跳转至对应路由
        next();
    }
})
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
export default router;
