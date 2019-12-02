<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <h1>{{ summary }}</h1>
    <candidate-profile :image="winner.image" :name="winner.name" :party="winner.party.title" >
    </candidate-profile>
    <h2>Overall voting pattern</h2>
    <table class="fixed centred">
      <thead>
        <tr><th>Measure</th><th>Votes</th><th>% of Total</th></tr>
      </thead>

      <tbody>
        <tr><td>Total</td><td>{{ result.votes.total }}</td><td>&mdash;</td></tr>
        <tr><td>Valid</td><td>{{ result.votes.valid }}</td><td>{{ proportion(result.votes.valid) }}</td></tr>
        <tr><td>Margin</td><td>{{ margin }}</td><td>{{ proportion(margin) }}</td></tr>
        <tr><td>Spoiled</td><td>{{ result.votes.invalid }}</td><td>{{ proportion(result.votes.invalid) }}</td></tr>
      </tbody>
    </table>

    <h2>Candidate votes</h2>
    <table>
      <thead>
        <tr><th>Candidate</th><th>Party</th><th>Votes</th><th>Share</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in candidates" :key="r.id">
          <td>{{ r.name }}</td>
          <td class="centred">{{ r.party.code }}</td>
          <td class="centred">{{ r.votes }}</td>
          <td class="centred">{{ proportion(r.votes) }}</td>
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
    winner() {
      return this.candidates[0];
    },
    margin() {
      const votes = this.candidates.map(x => x.votes).sort((a, b) => b.votes - a.votes);
      return this.candidates[0].votes - this.candidates[1].votes;
    },
    summary() {
      return `${ this.winner.party.title } win ${ this.result.name } by ${ this.margin } vote${this.margin === 1 ? '' : 's'}`;
    },
    twitterUrl() {
      const tweet = `${this.summary} #GeneralElection2019 https://britainelects.newstatesman.com/2019-results/`;
      return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(tweet) }`;
    },
    published() {
      return this.$store.state.published;
    } 
  },
  methods: {
    ...mapActions([
      'publish',
    ]),
    proportion(value) {
      return Math.round(100 * value / this.result.votes.valid) + '%';
    }
  }
}
</script>