<template>
  <nav>
    <ol>
      <li><router-link :to="{ name: 'home' }" exact>Home</router-link></li>
      <li><router-link :to="{ name: 'search' }">Search</router-link></li>
      <li><router-link :to="{ name: 'live-map' }">Map</router-link></li>
    </ol>
  </nav>
</template>
<style scoped>
ol {
  display: flex;
}
li {
  padding-bottom: 0.5em;
  box-sizing: border-box;
}
a {
  padding: 0.5rem;
  border-radius: 10px 10px 0 0;
  margin-right: 0.25em;
  text-decoration: none;
}
</style>