import Vue from 'vue';

import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin, components } from 'aws-amplify-vue';
import awsconfig from '../aws-exports.js';

Amplify.configure(awsconfig);

Vue.use(AmplifyPlugin, AmplifyModules);

console.dir(components);

export const amplifyVueComponents = components;
