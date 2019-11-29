import Vue from 'vue';
import Router from 'vue-router';
import { amplifyComponents, AmplifyEventBus } from './util/amplify';

import constituencyResults from './components/constituency-results.vue';
import constituencySelector from './components/constituency-selector.vue';
import confirmResults from './components/confirm-results.vue';
import home from './components/home.vue';
import liveMap from './components/live-map.vue';
import store from './store';

const DEBUG=true;

Vue.use(Router);

const router = new Router({
  routes: [
    { name: 'home', path: '/', component: home, meta: { requiresAuth: false } },
    { name: 'search', path: '/select', component: constituencySelector, meta: { requiresAuth: true } },
    {
      name: 'record',
      path: '/constituency/:id',
      component: constituencyResults,
      meta: {
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        store.commit('setupResult', to.params.id);
        next();
      },
    },
    { name: 'confirm', path: '/confirm', component: confirmResults, meta: { requiresAuth: true } },
    { name: 'live-map', path: '/live', component: liveMap, meta: { requiresAuth: true } },
    { name: 'auth', path: '/live', component: amplifyComponents.Authenticator },
  ],
});

let user;

async function getUser() {
  try {
    const data = Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
    if (data && data.signInUserSession) {
      store.commit('setUser', data);
      return data;
    }
  } catch(e) {
    store.commit('setUser', null);
    return null;
  }
}

getUser().then((user, error) => {
  if (user) {
    router.push({ path: '/' });
  }
});

AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut'){
    user = null;
    store.commit('setUser', null);
    router.push({path: '/auth'});
  } else if (state === 'signedIn') {
    user = await getUser();
    router.push({path: '/'});
  }
});

router.beforeResolve(async (to, from, next) => {
  if (DEBUG) return next();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: '/auth',
        query: {
          redirect: to.fullPath,
        },
      });
    }
    return next();
  }
  return next();
});

export default router;
