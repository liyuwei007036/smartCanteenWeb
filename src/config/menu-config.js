module.exports = [{
    name: '人员管理',
    id: 'personnelManagement',
    auths: ['employee'],
    icon: 'el-icon-user',
    sub: [{
        name: '组织管理',
        auths: ['originationManagement'],
        componentName: 'origination',
    },
        {
            name: '人员资料',
            componentName: 'employeeList',
            auths: ['employee:view'],
        }
    ],
}, {
    name: '卡片管理',
    id: 'cardManagemant',
    auths: ['icCard:list'],
    icon: 'el-icon-bank-card',
    sub: [
        {
            name: '充值补扣',
            auths: ['recharge:recharge', 'icCard:deduction'],
            componentName: 'rechargeDeduction',
        }, {
            name: '遗失补办',
            auths: ['icCard:loss', 'icCard:patch'],
            componentName: 'lostAndFound',
        },
    ],
}, {
    name: '角色管理',
    icon: 'el-icon-lock',
    id: 'roleManagement',
    auths: ['role:authorization', 'role:list'],
    sub: [{
        name: '角色列表',
        auths: ['role:list'],
        componentName: 'roleList',
    }, {
        name: '角色授权',
        auths: ['role:authorization'],
        componentName: 'roleAuth',
    }],
}, {
    name: '消费管理',
    id: 'consumptionManagement',
    icon: 'el-icon-wallet',
    auths: ['recharge:listlog', 'order:list'],
    sub: [{
        name: '充值记录',
        componentName: 'rechargeList',
        auths: ['recharge:listlog'],
    }, {
        name: '消费记录',
        componentName: 'consumeList',
        auths: ['order:list'],
    }],
}, {
    name: '日志管理',
    id: 'log',
    icon: 'el-icon-notebook-2',
    auths: ['log:operation', 'log:login'],
    sub: [
        {
            name: '操作日志',
            auths: ['log:operation'],
            componentName: 'operateLog',
        }, {
            name: '安全日志',
            auths: ['log:login'],
            componentName: 'loginLog',
        }
    ],
}, {
    name: '数据统计',
    id: 'dataStatistics',
    icon: 'el-icon-data-analysis',
    auths: [''],
    sub: [
        {
            name: '消费统计',
            auths: [''],
            componentName: 'consumerStatistics',
        },
    ],
}];
