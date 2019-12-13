import { basename } from 'path';
import { get } from '../util/http';
import { Storage } from '../util/amplify';

function getObjectKey(result) {
  const { id = undefined } = result;
  if (!id) return undefined;
  return `results/${id}.json`;
}

export async function setupResult({commit, state, getters}, id) {
  if ( state.result.id === id && !state.published ) return;
  const { name, candidates, incumbent, results2017, electorate } = getters.getConstituency(id);
  let existingResult = { candidates: [] };
  commit('published');
  try {
    const objectKey = getObjectKey({ id });
    const url = await Storage.get(objectKey);
    existingResult = await get(url);
  } catch( error ) {
    console.error(error.message);
  }

  const { events = [] } = existingResult;

  const result = {
    id,
    name,
    incumbent,
    results2017,
    events,
    candidates: candidates.map(c => ({
      id: c.id,
      name: c.name,
      party: {
        code: c.party_code,
        title: c.party_name,
      },
      img: c.image,
      votes: undefined,
      pc: undefined,
      change: undefined,
      ...existingResult.candidates.find(e => e.id === c.id),
    })),
    votes: {
      total: undefined,
      invalid: undefined,
      electorate,
      ...existingResult.votes,
    },
  };

  commit('setResult', result);
}

export async function publish({ commit, state, getters }, message = 'Updated') {
  const { result } = state;
  const stats = getters.stats;

  result.winner = getters.winner;
  result.votes = getters.votes;
  result.candidates = result.candidates.map(c => {
    const cStats = stats.party.find(x => x.id === c.id);
    if (cStats) {
      c.share = parseFloat(cStats.share);
      c.change = parseFloat(cStats.change);  
    }
    return c;
  });

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

export async function updateResultList({ commit, state }) {
  const keys = await Storage.list('results/');
  const resultList = keys
    .map(x => basename(x.key, '.json'))
    .map(x => state.constituencies.find(c => c.id === x))
    .map(({ id, name }) => ({ id, name }));
  commit('setResultList', resultList);
}