<script>
import candidateProfile from './candidate-profile.vue';
import { alphaSort } from '../util/array.js';

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  computed: {
    candidates() {
      return this.result.candidates.sort(alphaSort('name'));
    },
    result() {
      return this.$store.state.result;
    },
  },
  methods: {
    storeResult: function () {
      this.$store.commit('setResult', this.result);
      this.$router.push({ name: 'confirm' });
    }
  }
}
</script>
<template>
  <article>
    <h1>{{ result.name }}</h1>
    <p>ID: {{ result.id }}</p>
    <form v-on:submit.prevent="storeResult">
      <section id="overall">
        <label for="ballots">Total votes cast</label> <input class="brand-border" id="total" type="number" v-model="result.votes.total"/>
        <label for="ballots">Valid votes cast</label> <input class="brand-border" id="valid" type="number" v-model="result.votes.valid"/>
        <label for="spoiled">Invalid votes cast</label> <input class="brand-border" id="invalid" type="number" v-model="result.votes.invalid"/>
      </section>
      <candidate-profile v-for="({ name, party, id, image }, index) in candidates"
        :key="id" :name="name" :party="party.title" :image="image">
        <label :for="id">Votes</label> <input class="brand-border" :id="id" type="number" v-model="candidates[index].votes"/>
        </candidate-profile>
      <input type="submit" value="Save Result" class="brand-background">
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
</style>