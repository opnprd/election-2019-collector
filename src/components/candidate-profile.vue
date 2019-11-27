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
    grid-template-columns: minmax(100px, 20%) 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    align-items: center;
    border: dotted #bbb;
    border-width: 2px 0 0 0;
    padding: 0.2em;
    box-sizing: border-box;
  }
  p, img {
    padding: 0;
    margin: 0;
    display: block;
    overflow: hidden;
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
</style>