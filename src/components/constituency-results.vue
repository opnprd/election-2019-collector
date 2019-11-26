<script>
import candidateProfile from './candidate-profile.vue';
import { alphaSort } from '../util/array.js';

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  data() {
    return {
      constituency: this.$root.constituencies.find(x => x.id === this.$route.params.id),
      votes: {},
      ballots: undefined,
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
          cast: this.ballots,
          spoiled: this.spoiled,
        },
        votes: this.votes,
      };
      console.dir(result);
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
        <label for="ballots">Ballots cast</label> <input id="ballots" type="text" v-model="ballots"/>
        <label for="spoiled">Spoiled ballots</label> <input id="spoiled" type="text" v-model="spoiled"/>
      </section>
      <candidate-profile v-for="{ name, party_name, id, image } in candidates"
        :key="id":name="name" :party="party_name" :image="image">
        <label :for="id">Votes</label> <input :id="id" type="text" v-model="votes[id]"/>
        </candidate-profile>
      <input type="submit" value="Save Result">
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
    width: 95%;
    outline: 2px solid #c1002a;
  };
  input[type="submit"] {
    background-color: #c1002a;
    color: #fff;
    cursor: pointer;
    padding: 0.5em;
  }
</style>