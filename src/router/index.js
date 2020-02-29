import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/login/login.vue';
import Admin from '../views/admin/admin.vue';
import Home from '../views/home/home.vue';
import Measure from '../views/measure/measure.vue';
import SparePart from '../views/spare-part/sparePart.vue';
import Energy from '../views/energy/energy.vue';
import BaseData from '../views/energy/energy-base-data/baseData.vue';
import Report from '../views/energy/energy-report/report.vue';
import Settings from '../views/energy/energy-setttings/settings.vue';
import User from '../views/user/user.vue';
import Role from '../views/role/role.vue';
import menuList from '../config/menuConfig';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Admin,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'measure',
          component: Measure
        },
        {
          path: 'spare-part',
          component: SparePart
        },
        {
          path: 'energy',
          component: Energy,
          children: [
            {
              path: 'base-data',
              component: BaseData
            },
            {
              path: 'report',
              component: Report
            },
            {
              path: 'settings',
              component: Settings
            }
          ]
        },
        {
          path: 'user',
          component: User
        },
        {
          path: 'role',
          component: Role
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
});

function setTitle(list, key) {
  list.forEach((item) => {
    // debugger;
    if (item.children && item.children.length > 0) {
      setTitle(item.children, key);
    } else if (item.key === key) {
      router.app.$options.store.dispatch('setHeadTitle', item.title);
    }
  });
}

router.beforeEach((to, from, next) => {
  setTitle(menuList, to.path);
  next();
});

export default router;
