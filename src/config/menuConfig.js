// 导航配置
const menuList = [
  {
    title: '首页',
    key: '/home',
    icon: 'house',
  },
  {
    title: '测量仪器',
    key: '/measure',
    icon: 'menu',
  },
  {
    title: '备件采购',
    key: '/spare-part',
    icon: 'menu',
  },
  {
    title: '能源管理',
    key: '/energy',
    icon: 'menu',
    children: [
      {
        title: '基础数据',
        key: '/energy/base-data',
        icon: 'data-analysis'
      },
      {
        title: '报表中心',
        key: '/energy/report',
        icon: 'data-line'
      },
      {
        title: '管理配置',
        key: '/energy/settings',
        icon: 'pie-chart'
      }
    ]
  },
  {
    title: '用户管理',
    key: '/user',
    icon: 'user'
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'setting'
  }
]

export default menuList;
