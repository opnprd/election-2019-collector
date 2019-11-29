import Vue from 'vue';

import Amplify, * as AmplifyModules from 'aws-amplify';
import { components, AmplifyPlugin } from 'aws-amplify-vue';
export { AmplifyEventBus } from 'aws-amplify-vue';

import awsconfig from '../aws-exports.js';

Amplify.configure(awsconfig);
Vue.use(AmplifyPlugin, AmplifyModules);

export const amplifyComponents = components;
