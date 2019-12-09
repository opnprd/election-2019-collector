import Vue from 'vue';
import Router from 'vue-router';
import { amplifyComponents, AmplifyEventBus } from './util/amplify';

import results from './components/results.vue';
import search from './components/search.vue';
import confirmResults from './components/confirm.vue';
import home from './components/home.vue';
import liveMap from './components/live.vue';
import store from './store';

const DEBUG=false;
const AUTH=true;

Vue.use(Router);

const router = new Router({
  routes: [
    { name: 'home', path: '/', component: home, meta: { requiresAuth: false } },
    { name: 'search', path: '/search', component: search, meta: { requiresAuth: true } },
    {
      name: 'record',
      path: '/constituency/:id/edit',
      component: results,
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        if (!(store.state.result && store.state.result.id === to.params.id)) next(false);
        // await store.dispatch('setupResult', to.params.id);
        else next();
      },
    },
    { name: 'confirm', path: '/constituency/:id', component: confirmResults, meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        await store.dispatch('setupResult', to.params.id);
        next();
      },
    },
    { name: 'live-map', path: '/live', component: liveMap, meta: { requiresAuth: true } },
    { name: 'auth', path: '/auth', component: amplifyComponents.Authenticator },
  ],
});

async function getUser() {
  try {
    const data = await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
    if (data && data.signInUserSession) {
      store.commit('setUser', data);
      return data;
    }
  } catch(e) {
    store.commit('setUser', null);
    return null;
  }
}

if (AUTH) {
  let user;
  
  getUser().then((user, error) => {
    if (error) {
      throw error;
    }
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
}

export default router;
