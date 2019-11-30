import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions.js';
import * as mutations from './mutations.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    result: {},
    published: false,
    constituencies: [],
  },
  actions,
  getters: {
    getConstituency: (state) => (id) => {
      return state.constituencies.find(constituency => constituency.id === id);
    },
  },
  mutations,
});

export default store;
