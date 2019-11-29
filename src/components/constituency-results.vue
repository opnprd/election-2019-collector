<script>
import candidateProfile from './candidate-profile.vue';
import { alphaSort } from '../util/array.js';

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  data() {
    return {
      constituency: this.$store.state.constituencies.find(x => x.id === this.$route.params.id),
      votes: {},
      total: undefined,
      valid: undefined,
      spoiled: undefined,
    }
  },
  computed: {
    candidates() {
      return this.constituency.candidates.sort(alphaSort('name'));
    }
  },
  methods: {
    storeResult: function () {
      const result = {
        id: this.constituency.id,
        name: this.constituency.name,
        ballots: {
          total: this.total,
          valid: this.valid,
          spoiled: this.spoiled,
        },
        votes: this.votes,
      };
      this.$store.commit('setResult', result);
      this.$router.push({ name: 'confirm' });
    }
  }
}
</script>
<template>
  <article>
    <h1>{{ constituency.name }}</h1>
    <p>ID: {{ constituency.id }}</p>
    <form v-on:submit.prevent="storeResult">
      <section id="overall">
        <label for="ballots">Total votes cast</label> <input class="brand-border" id="total" type="number" v-model="total"/>
        <label for="ballots">Valid votes cast</label> <input class="brand-border" id="valid" type="number" v-model="valid"/>
        <label for="spoiled">Spoiled ballots</label> <input class="brand-border" id="spoiled" type="number" v-model="spoiled"/>
      </section>
      <candidate-profile v-for="{ name, party_name, id, image } in candidates"
        :key="id" :name="name" :party="party_name" :image="image">
        <label :for="id">Votes</label> <input class="brand-border" :id="id" type="number" v-model="votes[id]"/>
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