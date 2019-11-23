<script>
export default {
  props: [ 'image', 'name', 'party' ]
}
</script>
<template>
  <article>
    <img :src="image">
    <p>{{ name }}</p>
    <p>{{ party }}</p>
  </article>
</template>
<style scoped>
  article {
    padding: 1rem;
    display: grid;
    grid-template-columns: 5em 30em;
    grid-gap: 1rem;
  }
  p, img {
    padding: 0;
    margin: 0;
    display: block;
  }
  img {
    width: 100%;
    height: auto;
    grid-row-start: span 2;
  }
</style>