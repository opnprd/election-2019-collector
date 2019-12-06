import { isNull } from 'util';

import { makeNumber } from '../util/number.js';

export function setConstituency(state, constituencies) {
  state.constituencies = constituencies;
}

export function setUser(state, user) {
  state.user = user;
}

export function setResult(state, result) {
  state.published = false;
  state.result = result;
}

export function setVersion(state, version) {
  state.version = version;
}

export function clearResult(state) {
  state.published = false;
  state.result = {};
}

export function published(state) {
  state.published = true;
}

export function  updateVotes(state, { id, value }) {
  const MAX_NUMBER = 1e6;
  const invalidNumber = isNull(value.match(/^[0-9]*$/));
  if ( invalidNumber ) throw new Error('Invalid number');
  const number = makeNumber(value);
  if ( number > MAX_NUMBER ) throw new Error(`Number too large (> ${MAX_NUMBER})`);
  if ( number < 0 ) throw new Error('Negative count provided');
  if (['total', 'invalid', 'electorate'].includes(id)){
    state.result.votes[id] = number;
  } else {
    const index = state.result.candidates.findIndex(x => x.id === id);
    state.result.candidates[index].votes = number;
  }
}
