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

export function updateVotes(state, { id, value }) {
  if ( value < 0 ) throw new Error('Negative count provided');
  if (['total', 'invalid', 'electorate'].includes(id)){
    state.result.votes[id] = value;
  } else {
    const index = state.result.candidates.findIndex(x => x.id === id);
    state.result.candidates[index].votes = value;
  }
}
