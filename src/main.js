import Vue from 'vue'
import ElementUI from 'element-ui';
import echarts from 'echarts';
import App from './App.vue'
import router from './router'
import store from './store';
import eleConfig from './components';

Vue.use(ElementUI);

Vue.use(eleConfig);

Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
