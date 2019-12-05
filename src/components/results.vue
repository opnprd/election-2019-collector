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
    result() {
      return this.$store.state.result;
    },
    candidates() {
      return this.result.candidates.sort(alphaSort('name'));
    },
    votes() {
      return this.result.votes;
    },
    candidateVotes() {
      return this.candidates.filter(x => x.votes).reduce((a, { votes }) => a + votes, 0);
    },
    errors() {
      const { total, valid, invalid, electorate } = this.votes;
      const errors = []
      const diff = makeNumber(total - valid - invalid);
      if ( valid > total ) errors.push({ message: 'Valid votes greater than total votes' });
      if ( invalid > total ) errors.push({ message: 'Invalid votes greater than total '});
      if ( valid > electorate ) errors.push({ warning: true, message: 'Valid votes greater than electorate'});
      if ( invalid > electorate ) errors.push({ warning: true, message: 'Valid votes greater than electorate'});
      if ( total > electorate ) errors.push({ warning: true, message: 'Total votes greater than electorate'});
      if ( (valid + invalid) > electorate ) errors.push({ warning: true, message: 'Sum of valid and invalid votes greater than electorate'});
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
      if (['total', 'invalid', 'electorate'].includes(id)){
        result.votes[id] = makeNumber(value);
      } else {
        const index = result.candidates.findIndex(x => x.id === id);
        result.candidates[index].votes = makeNumber(value);
      }
      result.votes['valid'] = result.candidates.map(x => x.votes).filter(x => x).reduce((a,b) => a+b, 0);
      const winner = result.candidates.sort((a, b) => b.votes - a.votes);
      result.winner = winner[0];
      result.votes.margin = winner[0].votes - winner[1].votes;
      this.$store.commit('setResult', result);
    },
  },
};
</script>
<template>
  <article>
    <h1>{{ result.name }}</h1>
    <p>ID: {{ result.id }}</p>

    <form v-on:submit.prevent="storeResult">
      <candidate-profile v-for="({ name, party, id, img }, index) in candidates"
        :key="id" :name="name" :party="party.title" :image="img">
        <label :for="id">Votes</label>
        <input class="brand-border" :id="id" type="number" min="0" max="1000000" :value="candidates[index].votes"  @input="updateVotes"/>
      </candidate-profile>

      <section id="overall">
        <label for="valid">Valid votes cast</label>
        <input class="brand-border" id="valid" disabled="true" type="number" :value="votes.valid"/>
        <label for="invalid">Invalid votes cast</label>
        <input class="brand-border" id="invalid" type="number" min="0" max="1000000" :value="votes.invalid" @input="updateVotes"/>
        <label for="total">Total votes cast</label>
        <input class="brand-border" id="total" type="number" min="0" max="1000000" :value="votes.total" @input="updateVotes"/>
        <label for="electorate">Electorate</label>
        <input class="brand-border" id="electorate" type="number" min="0" max="1000000" :value="votes.electorate" @input="updateVotes"/>
      </section>

      <ul class="errors" v-if="errors.length > 0">
        <li v-for="({ message }, index) in errors" :key="index">{{ message }}</li>
      </ul>

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
    padding-bottom: 1em;
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