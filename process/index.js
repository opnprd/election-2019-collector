const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const { promisify } = require('util');
const { getParty, getByDemoclubId, get2017Party } = require('./party-lookups.js');

const registeredVoters = require('./registered.json');

async function streamWebResource(url) {
  return axios({
    method: 'get',
    url,
    responseType: 'stream',
  })
    .then(response => response.data);
}

async function convertCsv(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    stream.pipe(csv())
      .on('data', (data) => results.push(data))
      .on('error', reject)
      .on('end', () => {
        resolve(results);
      });
  });
}

const stripNamespace = (id) => id.replace(/.*:/, '');

function writeToFile(path, pretty = false) {
  return async (data) => {
    const opts = pretty ? [null, 2] : [];
    await promisify(fs.writeFile)(path, JSON.stringify(data, ...opts), { encoding: 'utf-8' });
    return data;
  };
}

function simplify(data) {
  const missing = {};
  const simplified = data.map(x => {
    const {
      id, name, image_url,
      party_id, party_name,
      post_id, post_label,
     } = x;
    let party;
    try {
      party = getByDemoclubId({
        party_id: parseInt(stripNamespace(party_id)),
        party_name,
      });
    } catch(err) {

      missing[err.party.id] = { count: 0, longName: new Set(), ...missing[err.party.id] };
      missing[err.party.id].count++;
      missing[err.party.id].longName = err.party.longName;
      party = err.party;
    }
    return {
      candidate_id: id,
      candidate_name: name,
      candidate_image: image_url,
      party_id: stripNamespace(party_id),
      party_name,
      party_code: party.code,
      constituency_id: stripNamespace(post_id),
      constituency_name: post_label,
    };
  });
  return simplified;
}

function summarise(data) {
  return Object.values(data.reduce((a, c) => {
    const {
      constituency_id,
      constituency_name,
      candidate_id,
      candidate_name,
      party_name,
      party_code,
    } = c;
    if (!Object.prototype.hasOwnProperty.call(a, constituency_id)) {
      a[constituency_id] = {
        id: constituency_id,
        name: constituency_name, candidates: [],
      };   
    }
    const image = `https://ge2019.odileeds.org/candidate/${candidate_id}.jpg`;
    a[constituency_id].candidates.push({
      id: candidate_id,
      name: candidate_name,
      image,
      party_name,
      party_code,
    });
    return a;
  }, {}));
}

async function getIncumbents(data) {
  const incumbent = await streamWebResource(incumbentData)
    .then(convertCsv);
  return data.map(c => {
    const i = incumbent.find(x => x.Constituency === c.name);
    if (!i) throw new Error (`Constituency not found ${c.name}`);
    const party = getParty(i.Party);
    c.incumbent = {
      mp: [i['First name'], i['Last name']].join(' '),
      party: { code: party.code, title: party.title },
    };
    return c;
  });
}

function add2017data(data) {
  return data.map(c => {
    const { winner, candidates, valid } = get2017Party(c.id);
    c.results2017 = {
      party: winner,
      votes: candidates.map(x => ({ party: x.code, pc: (x.votes * 100 / valid).toFixed(1) })),
    };
    return c;
  });
}

function addElectorate(data) {
  return data.map(c => {
    try {
      c.electorate = parseInt(registeredVoters.find(x => x.id === c.id).voters.replace(/,/g, ''));
    } catch(e) {
      console.log(`Can't find ${c.id} ${c.name}.`);
    }
    return c;
  });
}

const candidateData = 'https://candidates.democracyclub.org.uk/media/candidates-parl.2019-12-12.csv';
const incumbentData = 'https://www.theyworkforyou.com/mps/?f=csv&date=2019-11-06';

streamWebResource(candidateData)
  .then(convertCsv)
  .then(simplify)
  .then(summarise)
  .then(getIncumbents)
  .then(add2017data)
  .then(addElectorate)
  .then(writeToFile('./data/constituencies.json'))
  .catch(console.error);
