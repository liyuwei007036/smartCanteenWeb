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
  },
    {
      name: '遗失补办',
      componentName: 'patchCard',
    },
    {
      name: '销户退卡',
      componentName: 'accountCancellation',
    },
  ],
}, {
  name: '角色管理',
  id: 'roleManagement',
  sub: [{
    name: '角色列表',
    componentName: 'roleList',
  }, {
    name: '用户列表',
    componentName: 'userList',
  }],
}, {
  name: '消费管理',
  id: 'consumptionManagement',
  sub: [{
    name: '充值补贴',
    componentName: 'rechargeList',
  }, {
    name: '退费',
    componentName: 'refundList',
  }, {
    name: '补扣',
    componentName: 'deductList',
  }],
}, {
  name: '数据统计',
  id: 'dataStatistics',
}];
