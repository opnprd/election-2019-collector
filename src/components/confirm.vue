<template>
  <article>
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
        <tr><th>Candidate</th><th>Party</th><th>Share</th><th>Swing</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in candidates" :key="r.id">
          <td>{{ r.name }}</td>
          <td class="centred">{{ r.party.code }}</td>
          <td class="centred">{{ stats.party.find(x => x.party === r.party.code ).share }}% ({{ r.votes }})</td>
          <td class="centred">{{ stats.party.find(x => x.party === r.party.code ).swing }}</td>
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
      <router-link v-if="published === false" :to="{ name: 'record', params: { id: result.id }}" v-slot="{ href }">
        <a class="action secondary-action" :href="href">Amend</a>
      </router-link>
      <router-link v-if="published === true" :to="{ name: 'search' }" v-slot="{ href }">
        <a class="action brand-background" :href="href">Done</a>
      </router-link>
      <a class="action secondary-action" v-if="published === true" target='tweet' :href="twitterUrl">Tweet</a>
    </section>
  </article>
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
    result() {
      const result = this.$store.state.result;
      if (!result.id) this.$router.push({ name: 'home' });
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
      const { name: constituencyName, results2017, winner: { party: { code } } } = this.result;
      const { turnout, swingStatement, party } = this.stats;
      const url = 'https://britainelects.newstatesman.com/live-results/';
      const hashtags = 'GE2019';
      const partyResults = this.candidates
        .map(x => {
          const stats = party.find(v => v.party === x.party.code);
          const pc = (x.votes/this.votes.valid * 100).toFixed(1);
          const ge17 = this.result.results2017.votes.find(v => v.party === x.party.code);
          if (stats.swing) {
            var swingText = ` (${stats.swing > 0 ? '+' : ''}${stats.swing})`;
          } else {
            var swingText = '';
          }
          return `${partyCode(x.party.code).toUpperCase()}: ${stats.share}%${swingText}`;
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