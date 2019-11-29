import Vue from 'vue';
import Vuex from 'vuex';
import { get } from '../util/http';

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
  mutations: {
    setConstituency(state, constituencies) {
      state.constituencies = constituencies;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearResult(state) {
      state.published = false;
      state.result = {};
    },
    setResult(state, result) {
      state.published = false;
      state.result = result;
    },
    published(state) {
      state.published = true;
    },
  },
});

export default store;
