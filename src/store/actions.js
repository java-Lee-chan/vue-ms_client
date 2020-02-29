import {
  RECEIVE_USER,
  RESET_USER,
  SHOW_ERROE_MSG,
  SET_HEAD_TITLE
} from './mutation-types';

import {
  reqLogin
} from '../api';

export default {
  async login({ commit }, { username, password }) {
    // eslint-disable-next-line
    return new Promise(async (resolve) => {
      const result = await reqLogin(username, password);
      if (result.status === 0) {
        const user = result.data;
        commit(RECEIVE_USER, { user });
      } else {
        const { msg } = result;
        commit(SHOW_ERROE_MSG, { msg });
      }
      resolve();
    })
  },
  logout({ commit }) {
    commit(RESET_USER);
  },
  setHeadTitle({ commit }, headTitle) {
    commit(SET_HEAD_TITLE, { headTitle })
  }
}
