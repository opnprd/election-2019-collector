export function getConstituency(state) {
  return (id) => state.constituencies.find(constituency => constituency.id === id);
}

export function winner(state) {
  return state.result.candidates.filter(x => x.votes).sort((a, b) => b.votes - a.votes)[0];
}

export function winType(state, getters) {
  const [ HOLD, GAIN ] = [ 'HOLD', 'GAIN' ];
  return (getters.winner.party.code === state.result.results2017.party) ? HOLD : GAIN;
}

export function votes(state) {
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
}

export function stats(state, getters) {
  const { results2017, candidates } = state.result;
  if ( !candidates ) return null;
  const votes = getters.votes;
  const winner = getters.winner;
  const percentify = (v, base = votes.valid) => (v/base*100);
  const turnout = percentify(votes.valid, votes.electorate).toFixed(1);
  const get2017pc = (p) => {
    try {
      return results2017.votes.find(x => x.party === p).pc;
    } catch(error) { 
      console.error(`${p} not found in 2017 results`);
      return null;
    }
  };
  const lastWinnerResults = candidates.filter(x => x.party.code === results2017.party);
  let swing = null;
  if ( getters.winType === 'GAIN' && lastWinnerResults.length === 1 ) {
    const winner2017change = lastWinnerResults[0].share - get2017pc(results2017.party);
    swing = ((winner.change - winner2017change) / 2).toFixed(1);
    if (isNaN(swing)) swing = null;
  }
  const plusify = (v) => `${v > 0 ? '+' : ''}${v}`;
  const swingStatement = swing ? `${results2017.party} to ${winner.party.code} (${plusify(swing)})` : plusify(winner.change);
  const party = candidates.filter(x => x.votes)
    .map(({ id, party: { code: party }, votes }) => ({ id, party, votes })).sort((a, b) => b.votes - a.votes)
    .map(x => ({
      ...x,
      share: percentify(x.votes).toFixed(1),
      change: (percentify(x.votes)-get2017pc(x.party)).toFixed(1), 
    }));
  const majority = (votes.margin / votes.valid * 100).toFixed(1);
  return {
    turnout,
    swing,
    swingStatement,
    majority,
    party,
  };
}