<template>
  <nav>
    <ol>
      <li>
        <router-link :to="{ name: 'search' }">Locate</router-link>
      </li>
    </ol>
  </nav>
</template>
<style scoped>
ol {
  display: flex;
}
li {
  padding: 0.8em;
  border-radius: 10px 10px 0 0;
  background: hsl(347, 100%, 38%);
  color: #fff;
}
a {
  color: inherit;
}        
</style>