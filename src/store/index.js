import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    result: {},
    published: false,
  },
  actions: {
    async publish({ commit }) {
      // TODO replace with async submit to S3
      await new Promise(resolve => setTimeout(resolve, 2000));
      commit('published');
    },
  },
  mutations: {
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
