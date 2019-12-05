<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <h1>{{ summary }}</h1>
    <candidate-profile :image="result.winner.img" :name="result.winner.name" :party="result.winner.party.title" >
    </candidate-profile>
    <h2>Overall voting pattern</h2>
    <table class="fixed centred">
      <thead>
        <tr><th>Measure</th><th>Value</th><th>Comments</th></tr>
      </thead>

      <tbody>
        <tr><td>Electorate</td><td>{{ votes.electorate }}</td><td>Voters on electoral roll</td></tr>
        <tr><td>Turnout</td><td>{{ proportion(votes.valid, votes.electorate) }} ({{ votes.valid }})</td><td>Valid votes relative to electorate</td></tr>
        <tr><td>Majority</td><td>{{ proportion(margin, votes.valid) }} ({{ margin }})</td><td>Winning margin as proporton of valid votes</td></tr>
        <tr><td>Spoiled Ballots</td><td>{{ proportion(votes.invalid, votes.valid) }} ({{ votes.invalid || '-'}})</td><td>Number of invalid votes</td></tr>
        <tr><td>Total Votes Cast</td><td>{{ proportion(votes.total, votes.electorate) }} ({{ votes.total || '-' }})</td><td>Valid + invalid votes</td></tr>
      </tbody>
    </table>

    <h2>Candidate votes</h2>
    <table>
      <thead>
        <tr><th>Candidate</th><th>Party</th><th>Share</th><th>Votes</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in candidates" :key="r.id">
          <td>{{ r.name }}</td>
          <td class="centred">{{ r.party.code }}</td>
          <td class="centred">{{ proportion(r.votes, votes.valid)}}</td>
          <td class="centred">{{ r.votes }}</td>
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
      return this.result.candidates.sort((a, b) => b.votes - a.votes);
    },
    votes() {
      return this.result.votes;
    },
    margin() {
      const votes = this.candidates.map(x => x.votes).sort((a, b) => b.votes - a.votes);
      return this.candidates[0].votes - this.candidates[1].votes;
    },
    summary() {
      const { winner } = this.result;
      if ( winner.party.code == 'Spk' ) return `${winner.name} relected to ${this.result.name} as speaker`;
      const { incumbent } = this.result;
      const winType = incumbent.party.code == winner.party.code ? 'holds' : 'gains';
      return `${ winner.party.title } ${winType} ${ this.result.name } by ${ this.margin } vote${this.margin === 1 ? '' : 's'}`;
    },
    twitterUrl() {
      const { name: constituencyName } = this.result;
      const url = 'https://britainelects.newstatesman.com/live-results/';
      const hashtags = 'GE2019';;
      // TODO: Ben to provide desired tweet format.
      const tweet = `Results for ${constituencyName}:
      
${this.summary}
`;
      return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(tweet) }&url=${url}&hashtags=${hashtags}`;
    },
    published() {
      return this.$store.state.published;
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