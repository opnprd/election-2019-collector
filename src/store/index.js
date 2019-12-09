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
    winType: (state, getters) => {
      const [ HOLD, GAIN ] = [ 'HOLD', 'GAIN' ];
      return (getters.winner.party.code === state.result.results2017.party) ? HOLD : GAIN;
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
    stats: (state, getters) => {
      const { results2017, candidates } = state.result;
      const votes = getters.votes;
      const pcify = (v, base = votes.valid) => (v/base*100);
      const turnout = pcify(votes.valid, votes.electorate).toFixed(1);
      const winner = getters.winner;
      const get2017pc = (p) => {
        try {
          return results2017.votes.find(x => x.party === p).pc;
        } catch({}) {
          console.error(`${p} not found in 2017 results`);
          return null;
        }
      };
      const ge19WinnerShare = (winner.votes/votes.valid*100);
      const ge17WinnerShare = results2017.votes.find(x => x.party === results2017.party).pc;
      const swing = (ge19WinnerShare - ge17WinnerShare).toFixed(1);
      const plusify = (v) => `${v > 0 ? '+' : ''}${v}`;
      const swingStatement = getters.winType === 'GAIN' ? `${results2017.party} to ${winner.party.code} (${plusify(swing)})` : plusify(swing);
      const party = candidates.filter(x => x.votes)
        .map(({ id, party: { code: party }, votes }) => ({ id, party, votes })).sort((a, b) => b.votes - a.votes)
        .map(x => ({
          ...x,
          share: pcify(x.votes).toFixed(1),
          swing: (pcify(x.votes)-get2017pc(x.party)).toFixed(1), 
        }));
      const majority = (votes.margin / votes.valid * 100).toFixed(1);
      return {
        turnout,
        swing,
        swingStatement,
        majority,
        party,
      };
    },
  },
  mutations,
});

export default store;
