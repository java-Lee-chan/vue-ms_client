import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/login/login.vue';
import Admin from '../views/admin/admin.vue';
import Home from '../views/home/home.vue';
import Measure from '../views/measure/measure.vue';
import MeasureHome from '../views/measure/measure-home.vue';
import MeasureUpload from '../views/measure/measure-upload.vue';
import MeasureAddUpdate from '../views/measure/measure-add-update-detail.vue';
import SparePart from '../views/spare-part/spare-part.vue';
import SparePartHome from '../views/spare-part/spare-part-home.vue';
import SparePartUpload from '../views/spare-part/spare-part-upload.vue';
import SparePartAddUpdate from '../views/spare-part/spare-part-add-update.vue';
import Energy from '../views/energy/energy.vue';
import BaseData from '../views/energy/energy-base-data/base-data.vue';
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
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'measure',
          component: Measure,
          redirect: '/measure/home',
          children: [
            {
              path: 'home',
              component: MeasureHome
            },
            {
              path: 'upload',
              component: MeasureUpload
            },
            {
              name: 'measure-addupdate',
              path: 'addupdate',
              component: MeasureAddUpdate
            }
          ]
        },
        {
          path: 'spare-part',
          component: SparePart,
          redirect: '/spare-part/home',
          children: [
            {
              path: 'home',
              component: SparePartHome
            },
            {
              path: 'upload',
              component: SparePartUpload
            },
            {
              name: 'sparePart-addupdate',
              path: 'addupdate',
              component: SparePartAddUpdate
            }
          ]
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
    } else if (key.indexOf(item.key) === 0) {
      router.app.$options.store.dispatch('setHeadTitle', item.title);
    }
  });
}

router.beforeEach((to, from, next) => {
  setTitle(menuList, to.path);
  const { state } = router.app.$options.store;
  if (state.user && state.user._id) {
    next();
  } else if (to.path === '/login') {
    next();
  } else {
    next({
      path: '/login',
      replace: true
    });
  }
});

export default router;
