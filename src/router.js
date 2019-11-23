import constituencyResults from './components/constituency-results.vue';
import constituencySelector from './components/constituency-selector.vue';

export const router = new VueRouter({
  routes: [
    { name: 'search', path: '/select', component: constituencySelector },
    { name: 'record', path: '/constituency/:id', component: constituencyResults },
  ]
});

