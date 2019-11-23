import { get } from './util/http';
import { router } from './router.js';
import navigation from './components/navigation.vue';

import './style.scss';

export async function init({
  constituencyData
}) {
  const [
    constituencies
  ] = await Promise.all([
    get(constituencyData),
  ]);

  const app = new Vue({
    el: '#app',
    router,
    components: {
      'app-navigation': navigation,
    },
    data() {
      return {
        constituencies
      }
    }
  });  
}
