<template type="markdown">
  <article>
    <h1>Election Results Collector</h1>
    <p>This tool enables rapid collection of election results.</p>
    <p>Instructions:</p>
    <ol>
      <li>Open the <router-link :to="{ name: 'search' }">Locate</router-link> tab</li>
      <li>Find the constituency by typing in the Search box</li>
      <li>Enter the results</li>
    </ol>
  </article>
</template>
<style scoped>
  ol {
    list-style-type: decimal;
    padding-left: 2em;
    padding-top: 0.5em;
  }
  li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
</style>