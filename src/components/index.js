import ownButton from './own-button.vue';
import linkButton from './link-button.vue';

export default {
  install: (Vue) => {
    Vue.component(ownButton.name, ownButton);
    Vue.component(linkButton.name, linkButton);
  }
}
