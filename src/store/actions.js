import { get } from '../util/http';
import { Storage } from '../util/amplify';

function getObjectKey(result) {
  const { id = undefined } = result;
  if (!id) return undefined;
  return `results/${id}.json`;
}

export async function setupResult({commit, state, getters}, id) {
  if ( state.result.id === id && !state.published ) return;
  const { name, candidates, incumbent, results2017 } = getters.getConstituency(id);
  let existingResult = {};
  commit('published');
  try {
    const objectKey = getObjectKey({ id });
    const url = await Storage.get(objectKey);
    existingResult = await get(url);
  } catch( error ) {
    console.error(error.message);
  }

  const result = {
    id,
    name,
    candidates: candidates.map(x => ({
      id: x.id,
      name: x.name,
      party: {
        code: x.party_code,
        title: x.party_name,
      },
      img: x.image,
      votes: undefined,
    })),
    incumbent,
    results2017,
    events: [],
    ...existingResult,
    votes: {
      total: undefined,
      invalid: undefined,
      electorate: undefined,
      ...existingResult.votes,
    },
  };

  commit('setResult', result);
}


export async function publish({ commit, state, getters }, message = 'Updated') {
  const { result } = state;

  result.winner = getters.winner;
  result.votes = getters.votes;

  const date = new Date().toISOString();
  result.events.unshift({ date, message });

  const objectKey = getObjectKey(result);

  try {
    await Storage.put(objectKey, JSON.stringify(result, null, 2));
    commit('published');
  } catch( error ) {
    console.error(error);
    throw error;
  }
}

export async function initialise({ commit }, constituencyData) {
  const [data] = await Promise.all([
    get(constituencyData),
  ]);
  commit('setConstituency', data);
}
