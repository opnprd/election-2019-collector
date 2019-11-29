import Vue from 'vue';
import Vuex from 'vuex';
import { get } from '../util/http';

import * as mutations from './mutations.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    result: {},
    published: false,
    constituencies: [],
  },
  actions: {
    async publish({ commit }) {
      // TODO replace with async submit to S3
      await new Promise(resolve => setTimeout(resolve, 2000));
      commit('published');
    },
    async initialise({ commit }, constituencyData) {
      const data = await get(constituencyData);
      commit('setConstituency', data);
    },
  },
  getters: {
    getConstituency: (state) => (id) => {
      return state.constituencies.find(constituency => constituency.id === id);
    },
  },
  mutations,
});

export default store;
