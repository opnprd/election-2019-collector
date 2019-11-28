import Vue from 'vue';
import Router from 'vue-router';
import Amplify, * as AmplifyModules from 'aws-amplify';
import { components, AmplifyPlugin, AmplifyEventBus } from 'aws-amplify-vue';

import constituencyResults from './components/constituency-results.vue';
import constituencySelector from './components/constituency-selector.vue';
import confirmResults from './components/confirm-results.vue';
import home from './components/home.vue';
import liveMap from './components/live-map.vue';
import AmplifyStore from './store';

const DEBUG=true;

Vue.use(Router);
Vue.use(AmplifyPlugin, AmplifyModules);

const router = new Router({
  routes: [
    { name: 'home', path: '/', component: home, meta: { requiresAuth: false } },
    { name: 'search', path: '/select', component: constituencySelector, meta: { requiresAuth: true } },
    { name: 'record', path: '/constituency/:id', component: constituencyResults, meta: { requiresAuth: true } },
    { name: 'confirm', path: '/confirm', component: confirmResults, meta: { requiresAuth: true } },
    { name: 'live-map', path: '/live', component: liveMap, meta: { requiresAuth: true } },
    { name: 'auth', path: '/live', component: components.Authenticator },
  ],
});

let user;

async function getUser() {
  try {
    const data = Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
    if (data && data.signInUserSession) {
      AmplifyStore.commit('setUser', data);
      return data;
    }
  } catch(e) {
    AmplifyStore.commit('setUser', null);
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
    AmplifyStore.commit('setUser', null);
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
})

export default router;
