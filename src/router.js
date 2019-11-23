import constituencyResults from './components/constituency-results.vue';
import constituencySelector from './components/constituency-selector.vue';
import home from './components/home.vue';
import liveMap from './components/live-map.vue';

export const router = new VueRouter({
  routes: [
    { name: 'home', path: '/', component: home },
    { name: 'search', path: '/select', component: constituencySelector },
    { name: 'record', path: '/constituency/:id', component: constituencyResults },
    { name: 'live-map', path: '/live', component: liveMap },
  ]
});

