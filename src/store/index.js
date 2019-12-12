import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions.js';
import * as mutations from './mutations.js';
import * as getters from './getters.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    selectedConstituency: null, 
    result: {},
    published: false,
    constituencies: [],
    resultList: [],
  },
  actions,
  getters,
  mutations,
});

export default store;
