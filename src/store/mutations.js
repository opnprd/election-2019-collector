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

export function clearResult(state) {
  state.published = false;
  state.result = {};
}

export function published(state) {
  state.published = true;
}
