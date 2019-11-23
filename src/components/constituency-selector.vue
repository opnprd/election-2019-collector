<script>
import { alphaSort } from '../util/array.js';

export default {
  data() {
    return {
      constituencyLookup: this.$root.constituencies
        .map(c => ({ value: c.id, label: c.name }))
        .sort(alphaSort('label')),
      searchTerm: null,
    }
  },
  computed: {
    matches() {
      if (!this.searchTerm) return [];
      const searchRegExp = new RegExp(this.searchTerm, 'i');
      const matches = this.constituencyLookup.filter(c => c.label.search(searchRegExp) !== -1);
      return matches;
    }
  }
}
</script>
<template>
  <article>
    <label for="search">Search</label>
    <input id="search" type="text" v-model="searchTerm"/>
    <ol>
      <li v-for="{value, label} in matches" :key="value" >
        <router-link :to="{ name: 'record', params: { id: value }}">{{ label }}</router-link>
      </li>
    </ol>
  </article>
</template>

<style scoped>
article {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
ol {
  grid-column-start: span 2;
  list-style-type: none;
}
</style>