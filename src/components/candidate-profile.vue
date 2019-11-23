<script>
export default {
  props: [ 'image', 'name', 'party' ]
}
</script>
<template>
  <section>
    <p class="image"><img :src="image"></p>
    <p>{{ name }}</p>
    <p>{{ party }}</p>
  </section>
</template>
<style scoped>
  section {
    margin-top: 1rem;
    margin-bottom: 1rem;
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
  .image {
    grid-row-start: span 2;
  }
  img {
    width: 100%;
    height: auto;
  }
</style>