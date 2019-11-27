import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    result: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setResult(state, result) {
      state.result = result;
    },
  },
});

export default store;
