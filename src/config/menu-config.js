module.exports = [{
    name: '人员管理',
    id: 'personnelManagement',
    sub: [{
        name: '组织管理',
        componentName: 'origination',
    },
        {
            name: '人员资料',
            componentName: 'employeeList',
        }
    ],
}, {
    name: '卡片管理',
    id: 'cardManagemant',
    sub: [
        {
            name: '卡片列表',
            componentName: 'cardList',
        },
    ],
}, {
    name: '角色管理',
    id: 'roleManagement',
    sub: [{
        name: '角色列表',
        componentName: 'roleList',
    }, {
        name: '角色授权',
        componentName: 'roleAuth',
    }],
}, {
    name: '消费管理',
    id: 'consumptionManagement',
    sub: [{
        name: '充值记录',
        componentName: 'rechargeList',
    }, {
        name: '消费记录',
        componentName: 'consumeList',
    }],
}, {
    name: '数据统计',
    id: 'dataStatistics',
}];
