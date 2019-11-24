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
    <p>Begin typing a constituency name</p>
    <input id="search" type="text" v-model="searchTerm"/>
    <ol>
      <li v-for="{value, label} in matches" :key="value" >
        <router-link :to="{ name: 'record', params: { id: value }}">{{ label }}</router-link>
      </li>
    </ol>
  </article>
</template>

<style scoped>
  ol {
    list-style-type: none;
  }
  li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    line-height: 1.2em;
  }
  input {
    width: 100%;
    border: 0;
    outline: 0.5rem solid hsl(347, 100%, 38%);
    padding: 0.5rem;
    box-sizing: border-box;
  }
</style>