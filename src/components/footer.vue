<template>
  <footer>
    <p>Created by <a href="https://odileeds.org">ODI Leeds</a></p>
    <p v-if="user">Signed in as {{ user }} <router-link :to="{ name: 'signout' }">Sign Out</router-link></p>
  </footer>
</template>
<script>
export default {
  computed: {
    user() {
      const user = this.$store.state.user;
      if (user) return user.username;
      return undefined;
    }
  }
}
</script>
