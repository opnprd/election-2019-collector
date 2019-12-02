import { get } from '../util/http';
import { Storage } from '../util/amplify';

function getObjectKey(result) {
  const { id = undefined } = result;
  if (!id) return undefined;
  return `results/${id}.json`;
}

export async function setupResult({commit, state, getters}, id) {
  if ( state.result.id === id && !state.published ) return;
  const { name, candidates, incumbent } = getters.getConstituency(id);
  const baseResult = {
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
  let existingResult = {};
  try {
    const objectKey = getObjectKey(baseResult);
    const url = await Storage.get(objectKey);
    console.debug(url);
    existingResult = await get(url);
  } catch( error ) {
    console.error(error);
  }

  commit('setResult', { ...baseResult, ...existingResult });
}


export async function publish({ commit, state }) {
  const { result } = state;
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
  const data = await get(constituencyData);
  commit('setConstituency', data);
}
