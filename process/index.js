const axios = require('axios');
const csv = require('csv-parser')
const fs = require('fs');
const { promisify } = require('util');

async function streamWebResource(url) {
  return axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
    .then(response => response.data)
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
  })
}

const stripNamespace = (id) => id.replace(/.*\:/, '');

function writeToFile(path) {
  return async (data) => {
    await promisify(fs.writeFile)(path, JSON.stringify(data), { encoding: 'utf-8' });
    return data;
  }
}

function simplify(data) {
  return data.map(x => {
    const {
      id, name, honorific_prefix, honorific_suffix, image_url,
      party_id, party_name,
      post_id, post_label,
     } = x;
    return {
      candidate_id: id,
      candidate_name: name,
      candidate_image: image_url,
      party_id: stripNamespace(party_id),
      party_name,
      constituency_id: stripNamespace(post_id),
      constituency_name: post_label,
    }
  })
}

function summarise(data) {
  return Object.values(data.reduce((a, c) => {
    const {
      constituency_id,
      constituency_name,
      candidate_id,
      candidate_name,
      candidate_image,
      party_id,
      party_name,
    } = c;
    if (!Object.prototype.hasOwnProperty.call(a, constituency_id)) {
      a[constituency_id] = {
        id: constituency_id,
        name: constituency_name, candidates: []
      };   
    }
    a[constituency_id].candidates.push({
      id: candidate_id,
      name: candidate_name,
      image: candidate_image,
      party_id,
      party_name,
    })
    return a;
  }, {}));
}

const candidateData = 'https://candidates.democracyclub.org.uk/media/candidates-parl.2019-12-12.csv';
streamWebResource(candidateData)
  .then(convertCsv)
  .then(simplify)
  .then(summarise)
  .then(writeToFile('./data/constituencies.json'))
  .then(() => console.log('Done!'));

