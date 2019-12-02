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
    elections: {
      2019: {    
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
        votes: {
          total: undefined,
          valid: undefined,
          invalid: undefined,
        },
      },
      2017: {},
      2015: {},
    },
    events: [],
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


export async function publish({ commit, state }, message = 'Updated') {
  console.log(message);
  const { result } = state;
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
  const data = await get(constituencyData);
  commit('setConstituency', data);
}
