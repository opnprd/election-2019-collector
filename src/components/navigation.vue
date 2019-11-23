<template>
  <nav>
    <ol>
      <li><router-link :to="{ name: 'home' }" exact>Home</router-link></li>
      <li><router-link :to="{ name: 'search' }">Locate</router-link></li>
      <li><router-link :to="{ name: 'live-map' }">Live Map</router-link></li>
    </ol>
  </nav>
</template>
<style scoped>
ol {
  display: flex;
}
li {
  padding-bottom: 0.5em;
}
a {
  padding: 0.5em;
  border-radius: 10px 10px 0 0;
  background: #c1002a;
  color: #fff;
  margin-right: 0.2em;
}
.router-link-active {
  background: #e2001a;
}
</style>