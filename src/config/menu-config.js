module.exports = [{
    name: '人员管理',
    id: 'personnelManagement',
    auths: ['employee:view', 'origination:view'],
    sub: [{
        name: '组织管理',
        auths: ['origination:view'],
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
    auths: ['icCard'],
    sub: [
        {
            name: '卡片列表',
            auths: ['icCard:list'],
            componentName: 'cardList',
        },
    ],
}, {
    name: '角色管理',
    id: 'roleManagement',
    auths: ['role'],
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
    auths: ['order'],
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
    name: '数据统计',
    id: 'dataStatistics',
    auths: [''],
}];
