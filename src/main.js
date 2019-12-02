import App from './App.vue';
import Vue from 'vue';
import router from './router';
import store from './store';

import './style.scss';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
  created() {
    this.$store.dispatch('initialise', 'data/constituencies.json');
  },
  components: {
    App,
  },
});
