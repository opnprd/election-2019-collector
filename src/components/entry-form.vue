<script>
import candidateProfile from './candidate-profile.vue';

const alphaSort = (key) => {
  return (a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  }
}

export default {
  components: {
    'candidate-profile': candidateProfile,
  },
  data() {
    return {
      constituencyLookup: this.$root.constituencies
        .map(c => ({ value: c.id, label: c.name }))
        .sort(alphaSort('label')),
      constituency: undefined,
    }
  },
  computed: {
    candidates() {
      // `this` points to the vm instance
      if (!this.constituency) return [];
      console.log(this.constituency.value);
      return this.$root.constituencies.find(x => x.id === this.constituency.value).candidates.sort(alphaSort('name'));
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
  <form v-on:submit.prevent="storeResult">
    <select v-model="constituency">
      <option v-for="c in constituencyLookup" :key="c.value" :value="c">{{ c.label }}</option>
    </select>
    <candidate-profile v-for="{ name, party_name, id, image } in candidates"
      :key="id":name="name" :party="party_name" :image="image"></candidate-profile>
    <input type="submit" value="Save Result">
  </form>
</template>