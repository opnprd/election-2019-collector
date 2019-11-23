<script>
import candidateProfile from './candidate-profile.vue';
import { alphaSort } from '../util/array.js';

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  data() {
    return {
      constituency: this.$root.constituencies.find(x => x.id === this.$route.params.id)
    }
  },
  computed: {
    candidates() {
      return this.constituency.candidates.sort(alphaSort('name'));
    }
  },
  methods: {
    storeResult: function () {
      console.log(this.constituency);
      console.log(this.winner);
    }
  }
}
</script>
<template>
  <article>
    <h1>{{ constituency.name }} ({{ constituency.id }})</h1>
    <form v-on:submit.prevent="storeResult">
      <candidate-profile v-for="{ name, party_name, id, image } in candidates"
        :key="id":name="name" :party="party_name" :image="image"></candidate-profile>
      <input type="submit" value="Save Result">
    </form>
  </article>
</template>