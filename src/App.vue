<script>
import { router } from "./router.js";
import navigation from "./components/navigation.vue";

export default {
  components: {
    "app-navigation": navigation,
  },
};
</script>
<template>
  <article id="app">
    <header>
      <app-navigation></app-navigation>
    </header>
    <router-view></router-view>
  </article>
</template>