<template>
  <article v-if="loaded">
    <p>Results for {{ result.name }}.</p>
    <h1>{{ summary }}</h1>
    <p>Swing: {{ stats.swingStatement }}</p>
    <candidate-profile :image="winner.img" :name="winner.name" :party="winner.party.title" >
    </candidate-profile>
    <h2>Overall voting pattern</h2>
    <table class="fixed centred">
      <thead>
        <tr><th>Measure</th><th>Value</th><th>Comments</th></tr>
      </thead>

      <tbody>
        <tr><td>Electorate</td><td>{{ votes.electorate }}</td><td>Voters on electoral roll</td></tr>
        <tr><td>Turnout</td><td>{{ stats.turnout }}% ({{ votes.valid }})</td><td>Valid votes relative to electorate</td></tr>
        <tr><td>Majority</td><td>{{ stats.majority }}% ({{ votes.margin }})</td><td>Winning margin as proporton of valid votes</td></tr>
        <tr><td>Spoiled Ballots</td><td>{{ proportion(votes.invalid, votes.valid) }} ({{ votes.invalid || '-'}})</td><td>Number of invalid votes</td></tr>
        <tr><td>Total Votes Cast</td><td>{{ proportion(votes.total, votes.electorate) }} ({{ votes.total || '-' }})</td><td>Valid + invalid votes</td></tr>
      </tbody>
    </table>

    <h2>Candidate votes</h2>
    <table>
      <thead>
        <tr><th>Candidate</th><th>Party</th><th>Share</th><th>Change (GE17)</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in candidates" :key="r.id">
          <td>{{ r.name }}</td>
          <td class="centred">{{ r.party.code }}</td>
          <td class="centred">{{ stats.party.find(x => x.id === r.id ).share }}% ({{ r.votes }})</td>
          <td class="centred">{{ stats.party.find(x => x.id === r.id ).change }}</td>
        </tr>
        <tr v-for="r in candidatesWithNoVotes" :key="r.id">
          <td>{{ r.name }}</td>
          <td class="centred">{{ r.party.code }}</td>
          <td class="centred"></td>
          <td class="centred"></td>
        </tr>
      </tbody>
    </table>

    <section id="actions">
      <a class="action brand-background" v-if="published === false" v-on:click="publish(summary)">Publish</a>
      <a class="action secondary-action" v-if="published === true" target='tweet' :href="twitterUrl">Tweet</a>
      <router-link :to="{ name: 'record', params: { id: result.id }}" v-slot="{ href }">
        <a class="action secondary-action" :href="href">Amend</a>
      </router-link>
    </section>
  </article>
  <article v-else>Loading...</article>
</template>
<style scoped>
table {
  width: 100%;
  font-size: 0.7em;
}
.fixed {
  table-layout: fixed;
}
th {
  background-color: #aaa;
}
td, th {
  border: 1px solid #aaa;
  padding: 0.3em;
}
.centred {
  text-align: center;
}
#actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5em;
}
.action {
  text-align: center;
  padding: 0.5em;
  box-sizing: border-box;
  display: block;
  text-decoration: none;
  cursor: pointer;
}
.secondary-action {
  background-color: #888;
  color: #fff;
}
</style>
</style>
<script>
import { mapActions } from 'vuex';
import candidateProfile from './candidate-profile.vue';

const codes = {
  Con: 'Con',
  Lab: 'Lab',
  LD: 'LDem',
  Green: 'Grn',
  Brexit: 'Brex',
  SNP: 'SNP',
  UKIP: 'UKIP',
  PC: 'PC',
  Ind: 'Ind',
  DUP: 'DUP',
  UUP: 'UUP',
  SF: 'SF',
  SDLP: 'SDLP',
  Alliance: 'Alln',
  Spk: 'Spk',
  XSpk: 'Ex-Spk',
  Monster: 'Mon',
};

function partyCode(code) {
  if (!Object.keys(codes).includes(code)) return 'Oth';
  return codes[code];
}

export default {
  components: {
    candidateProfile
  },
  computed: {
    loaded() {
      const result = this.$store.state.result;
      if (!result) return false
      const { result: { id, candidates } = {}} = this.$store.state;
      if (id !== this.$route.params.id) return false;
      if (candidates.filter(x => x.votes).length == 0) {
        this.$router.push({ name: 'record', params: { id: this.$route.params.id }});
        this.$store.commit('unpublished');
        return false;
      }
      return true;
    },
    result() {
      const result = this.$store.state.result;
      return result;
    },
    candidates() {
      return this.$store.state.result.candidates.filter(x => x.votes).sort((a, b) => b.votes - a.votes);
    },
    candidatesWithNoVotes() {
      return this.$store.state.result.candidates.filter(x => !x.votes);
    },
    stats() {
      return this.$store.getters.stats;
    },
    votes() {
      return this.$store.getters.votes;
    },
    summary() {
      if ( this.winner.party.code == 'Spk' ) return `${this.winner.name} relected to ${this.result.name} as speaker`;
      return `${ this.result.name }: ${ this.winner.party.code } ${this.$store.getters.winType}`;
    },
    twitterUrl() {
      const { name: constituencyName, results2017 } = this.result;
      const { turnout, swingStatement, party } = this.stats;
      const { party: { code } } = this.winner
      const displayCode = partyCode(code);
      const getUrl = () => {
        const carded = [ 'Alli', 'Brex', 'Con', 'DUP', 'Grn', 'Ind', 'Lab', 'LDem', 'PC', 'SDLP', 'SF', 'SNP' ];
        if (this.$store.getters.winType === 'GAIN' && carded.includes(displayCode)) {
          return `https://ge2019.odileeds.org/card/${displayCode}`;
        }
        return 'https://britainelects.newstatesman.com/live-results/';
      }
      const url = getUrl();
      const hashtags = 'GE2019';
      const partyResults = this.candidates
        .map(x => {
          // TODO aggregate IND, OTH, etc and hide change?
          const stats = party.find(v => v.id === x.id);
          return {
            name: x.name.split(/\s+/).reverse()[0],
            partyName: x.party.title,
            code: x.party.code,
            share: stats.share,
            change: stats.change,
          }
        })
        .sort((a, b) => b.share - a.share)
        .filter((v, i) => i < 5)
        .map(data => {
          const { code, change, name, share } = data
          const minorityParties = ['Ind', 'Oth'];;
          if (change && !minorityParties.includes(code)) {
            var changeText = ` (${change > 0 ? '+' : ''}${change})`;
          } else {
            var changeText = '';
          }
          let partyText = partyCode(code).toUpperCase();
          if (minorityParties.includes(code)) {
            partyText += ` (${name})`;
          }
          return `${partyText}: ${share}%${changeText}`;
        })
        .join('\n');
      const tweet = `${this.summary}

${partyResults}

Swing: ${swingStatement}
Turnout: ${turnout}%
Full results:`;
      return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(tweet) }&url=${url}&hashtags=${hashtags}`;
    },
    published() {
      return this.$store.state.published;
    },
    winner() {
      return this.$store.getters.winner;
    }
  },
  methods: {
    ...mapActions([
      'publish',
    ]),
    proportion(value, baseline) {
      return value && baseline ? Math.round(100 * value / baseline) + '%' : 'N/A';
    }
  }
}
</script>