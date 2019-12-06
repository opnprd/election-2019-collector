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
    winner: (state) => {
      return state.result.candidates.filter(x => x.votes).sort((a, b) => b.votes - a.votes)[0];
    },
    votes: (state) => {
      const candidateVotes = state.result.candidates.map(x => x.votes).filter(x => x).sort((a, b) => b - a);
      const votes = state.result.votes;
      const valid = candidateVotes.reduce((a, c) => a + c, null);
      const margin = candidateVotes[0] - candidateVotes[1];
      const total = votes.invalid ? votes.invalid + valid : undefined;
      const invalid = votes.total ? votes.total - valid : undefined;
      return {
        total,
        invalid,
        ...votes,
        valid,
        margin,
      };
    },
  },
  mutations,
});

export default store;
