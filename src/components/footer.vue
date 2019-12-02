<template>
  <footer>
    <p>Created by <a href="https://odileeds.org">ODI Leeds</a></p>
    <p v-if="user">Signed in as {{ user }}</p>
    <sign-out v-if="user"></sign-out>
  </footer>
</template>
<style scoped>
  p {
    padding-top: 1em;
  }
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
    }
  }
}
</script>
