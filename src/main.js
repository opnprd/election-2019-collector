import { get } from './util/http';
import { router } from './router.js';

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
    data() {
      return {
        constituencies
      }
    }
  });  
}
