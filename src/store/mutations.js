import {
  RECEIVE_USER,
  SHOW_ERROE_MSG,
  RESET_USER,
  SET_HEAD_TITLE
} from './mutation-types';

import storageUtils from '../utils/storageUtils';

export default {
  [RECEIVE_USER](state, { user }) {
    state.user = user;
    storageUtils.saveUser(user);
    state.msg = '';
  },
  [SHOW_ERROE_MSG](state, { msg }) {
    state.msg = msg;
  },
  [RESET_USER](state) {
    storageUtils.removeUser();
    state.user = null;
  },
  [SET_HEAD_TITLE](state, { headTitle }) {
    state.title = headTitle;
  }
}
