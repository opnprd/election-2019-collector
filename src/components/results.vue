<script>
import candidateProfile from './candidate-profile.vue';
import { alphaSort } from '../util/array.js';

const makeNumber = (v) => {
  const num = parseInt(v);
  return Number.isNaN(num) ? undefined : num;
}

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  computed: {
    candidates() {
      return this.result.candidates.sort(alphaSort('name'));
    },
    candidateVotes() {
      return this.candidates.filter(x => x.votes).reduce((a, { votes }) => a + votes, 0);
    },
    result() {
      return this.$store.state.result;
    },
    errors() {
      const { votes: { total, valid, invalid }, candidates } = this.result;
      const errors = []
      const diff = makeNumber(total - valid - invalid);
      if ( valid > total ) errors.push({ message: 'Valid votes greater than total votes' });
      if ( invalid > total ) errors.push({ message: 'Invalid votes greater than total '});
      if ( this.candidateVotes > 0 && this.candidateVotes != valid ) errors.push({ warning: true, message: `Valid votes not equal to votes for candidates (${this.candidateVotes})` });
      if ( diff ) errors.push({ warning: true, message: `Total is not sum of valid and invalid votes (difference is ${diff})` });

      return errors;
    },
    preventSubmit() {
      return this.errors.filter(x => x.warning != true).length > 0;
    },
  },
  methods: {
    updateVotes: function (e) {
      const result = this.result;
      const { id, value } = e.target
      if (['total', 'valid', 'invalid'].includes(id)){
        result.votes[id] = makeNumber(value);
      } else {
        const index = result.candidates.findIndex(x => x.id === id);
        result.candidates[index].votes = makeNumber(value);
      }
      this.$store.commit('setResult', result);
    },
  },
};
</script>
<template>
  <article>
    <h1>{{ result.name }}</h1>
    <p>ID: {{ result.id }}</p>

    <ul class="errors" v-if="errors.length > 0">
      <li v-for="({ message }, index) in errors" :key="index">{{ message }}</li>
    </ul>

    <form v-on:submit.prevent="storeResult">
      <section id="overall">
        <label for="ballots">Total votes cast</label>
        <input class="brand-border" id="total" type="number" :value="result.votes.total" @input="updateVotes"/>
        <label for="ballots">Valid votes cast</label>
        <input class="brand-border" id="valid" type="number" :value="result.votes.valid" @input="updateVotes"/>
        <label for="spoiled">Invalid votes cast</label>
        <input class="brand-border" id="invalid" type="number" :value="result.votes.invalid" @input="updateVotes"/>
      </section>
      <candidate-profile v-for="({ name, party, id, image }, index) in candidates"
        :key="id" :name="name" :party="party.title" :image="image">
        <label :for="id">Votes</label>
        <input class="brand-border" :id="id" type="number" :value="candidates[index].votes"  @input="updateVotes"/>
        </candidate-profile>
      <router-link v-if="!preventSubmit" :to="{ name: 'confirm' }" v-slot="{ href }"><a class="action brand-background" :href="href">Save Result</a></router-link> 
    </form>
  </article>
</template>
<style scoped>
  #overall {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5em 0.5em;
    align-items: center;
  }
  label {
    font-size: smaller;
    color: #888;
  }
  input {
    width: 100%;
  };
  input[type="number"] {
    border-width: 2px;
  }
  .errors {
    border: solid 2px red;
    padding: 0.5rem;
    font-size: 0.8em;
  }
</style>