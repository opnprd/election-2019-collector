<script>
export default {
  props: [ 'image', 'name', 'party' ]
}
</script>
<template>
  <section>
    <p class="image"><img :src="image"></p>
    <p>{{ name }}</p>
    <p class="party">{{ party }}</p>
    <slot></slot>
  </section>
</template>
<style scoped>
  section {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 5em auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.5rem;
    align-items: center;
    outline: 2px solid #aaa;
    padding: 0.2em;
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
  .party {
    font-size: smaller;
  }
  .wide {
    grid-column-start: span 2;
  }
</style>