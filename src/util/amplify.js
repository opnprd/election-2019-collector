import Vue from 'vue';

import Amplify, * as AmplifyModules from 'aws-amplify';
import { components, AmplifyPlugin } from 'aws-amplify-vue';
export { AmplifyEventBus } from 'aws-amplify-vue';

import awsconfig from '../aws-exports.js';

const s3config = {
  Auth: {
    identityPoolId: 'eu-west-2:1afb7b8e-effc-4619-b1c0-3136a7e9f33c', //REQUIRED - Amazon Cognito Identity Pool ID
    region: 'eu-west-2', // REQUIRED - Amazon Cognito Region
    userPoolId: 'eu-west-2_5pr5F2h37', //OPTIONAL - Amazon Cognito User Pool ID   
    // userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
    AWSS3: {
        bucket: 'odileeds-uk-election-2019', //REQUIRED -  Amazon S3 bucket
        region: 'eu-west-2', //OPTIONAL -  Amazon service region
    },
  },
};

const config = { ...awsconfig, ...s3config };

Amplify.configure(config);
Vue.use(AmplifyPlugin, AmplifyModules);

export const amplifyComponents = components;
export const Storage = AmplifyModules.Storage;
