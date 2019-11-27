<script>
import { router } from "./router.js";
import appNavigation from "./components/navigation.vue";
import appFooter from './components/footer.vue';

export default {
  components: {
    appNavigation,
    appFooter,
  },
};
</script>
<template>
  <article id="app">
    <header>
      <app-navigation></app-navigation>
    </header>
    <router-view></router-view>
    <app-footer></app-footer>
  </article>
</template>