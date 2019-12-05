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
      party: {
        code: x.party_code,
        title: x.party_name,
      },
      img: x.image,
      votes: undefined,
    })),
    incumbent,
    winner: undefined,
    votes: {
      total: undefined,
      valid: undefined,
      invalid: undefined,
      electorate: undefined,
      margin: undefined,
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

export function updateVotes({ commit, state }, { id, value }) {
  const result = state.result;
  console.log(id, value);
  if (['total', 'invalid', 'electorate'].includes(id)){
    result.votes[id] = value;
  } else {
    const index = result.candidates.findIndex(x => x.id === id);
    result.candidates[index].votes = value;
  }
  const candidatesWithVotes = result.candidates.filter(x => x.votes);
  result.votes['valid'] = candidatesWithVotes.map(x => x.votes).filter(x => x).reduce((a,b) => a+b, 0);
  const winner = candidatesWithVotes.filter(x => x.votes).sort((a, b) => b.votes - a.votes);
  result.winner = winner[0];
  result.votes.margin = (winner.length > 1) ? winner[0].votes - winner[1].votes : undefined;
  commit('setResult', result);
}

export async function initialise({ commit }, constituencyData) {
  const data = await get(constituencyData);
  commit('setConstituency', data);
}
