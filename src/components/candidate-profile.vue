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
    grid-template-columns: 5em auto;
    grid-template-rows: minmax(1em, auto);
    grid-column-gap: 1rem;
    grid-row-gap: 0.5rem;
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