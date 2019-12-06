<template>
  <footer>
    <ul>
      <li>
        <p v-if="user">Signed in as {{ user }}</p>
        <sign-out v-if="user"></sign-out>
      </li>
      <li>
        <p>Version: {{ version }}</p>
        <p>Created by <a href="https://odileeds.org">ODI Leeds</a></p>
      </li>
    </ul>
  </footer>
</template>
<style scoped>
  p {
    font-size: 0.8em;
    padding-top: 1em;
  }
  ul { display: flex; }
  li { padding-right: 1em; }
</style>
<script>

import { amplifyComponents } from '../util/amplify';

const { SignOut } = amplifyComponents;

export default {
  components: {
    SignOut,
  },
  computed: {
    user() {
      const user = this.$store.state.user;
      if (user) return user.attributes.email;
      return undefined;
    },
    version() {
      return this.$store.state.version;
    }
  }
}
</script>
