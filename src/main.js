import entryForm from './components/entry-form.vue';
import { get } from './util/http';

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
    components: {
      'entry-form': entryForm,
    },
    data() {
      return {
        constituencies
      }
    }
  });  
}
