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

export function setupResult(state, id) {
  if ( state.result.id === id ) return;
  const { name, candidates, incumbent } = this.getters.getConstituency(id);
  state.result = {
    id,
    name,
    candidates: candidates.map(x => ({
      id: x.id,
      name: x.name,
      image: x.image,
      party: {
        code: x.party_code,
        title: x.party_name,
      },
      votes: undefined,
    })),
    incumbent,
    votes: {
      total: undefined,
      valid: undefined,
      invalid: undefined,
    },
  };
}
