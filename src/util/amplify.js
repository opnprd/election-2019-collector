import Vue from 'vue';

import Amplify, * as AmplifyModules from 'aws-amplify';
import { components, AmplifyPlugin } from 'aws-amplify-vue';
export { AmplifyEventBus } from 'aws-amplify-vue';

import awsconfig from '../aws-exports.js';

const s3config = {
  Storage: {
    AWSS3: {
        bucket: 'odileeds-uk-election-2019', //REQUIRED -  Amazon S3 bucket
        region: 'eu-west-2', //OPTIONAL -  Amazon service region
    },
  },
};

const config = { ...awsconfig, ...s3config };
console.dir(config);

Amplify.configure(config);
Vue.use(AmplifyPlugin, AmplifyModules);

export const amplifyComponents = components;
