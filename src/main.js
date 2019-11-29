// import Vue from 'vue';
import App from './App.vue'
import Vue from 'vue';
import router from './router';
import store from './store';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { components } from 'aws-amplify-vue';

import './style.scss';

Vue.config.productionTip = false;

Amplify.configure(aws_exports)

const app = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
  created() {
    this.$store.dispatch('initialise', 'data/constituencies.json');
  },
  components: {
    App,
    ...components,
  }
});
