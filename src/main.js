// import Vue from 'vue';
import App from './App.vue'
import router from './router';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { components } from 'aws-amplify-vue';
import { get } from './util/http';

import './style.scss';

Amplify.configure(aws_exports)

async function init({
  constituencyData,
}) {
  const [
    constituencies,
  ] = await Promise.all([
    get(constituencyData),
  ]);

  const app = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
      App,
      ...components,
    },
    data() {
      return {
        constituencies,
      };
    },
  });
}

init({ constituencyData: 'data/constituencies.json' });