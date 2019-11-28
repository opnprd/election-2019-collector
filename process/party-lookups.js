const parties = require('./parties.json');

function getParty(name) {
  const matcher = (p) => {
    const { title = p.code, aliases = [] } = p;
    return title === name || aliases.includes(name);
  };
  const theParty = parties.find(matcher);
  if (!theParty) throw new Error(`Can't find ${name}`);
  if (!theParty.title) theParty.title = theParty.code;
  return theParty;
}

function getByDemoclubId({ party_id, party_name }) {
  const democlubId = parseInt(party_id);
  const matcher = (p) => {
    let { id = [] } = p;
    if (!Array.isArray(id)) id = [id];
    return id.includes(democlubId); 
  };
  const theParty = parties.find(matcher);
  if (!theParty) {
    const err = new Error(`Can't find ${party_name} - ${party_id}`);
    err.party = {
      id: democlubId,
      longName: party_name,
    };
    throw err;
  }
  theParty.longName = party_name;
  return theParty;
}

module.exports = {
  getParty,
  getByDemoclubId,
};
