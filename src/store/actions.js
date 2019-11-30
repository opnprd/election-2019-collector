import { get } from '../util/http';
import { Storage } from '../util/amplify';

function getObjectKey(result) {
  const { id = undefined } = result;
  if (!id) return undefined;
  return `results/${id}.json`;
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
