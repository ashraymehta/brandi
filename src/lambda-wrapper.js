'use strict';
import 'reflect-metadata';
import {AllSetupSteps} from './setup/all-setup.steps';

const serverless = require('serverless-http');
const awsServerlessExpress = require('aws-serverless-express');

exports.handler = async (event, context) => {
  const {application} = await new AllSetupSteps().execute();
  serverless(application, {basePath: ''});
  const server = awsServerlessExpress.createServer(application);
  return new Promise((resolve, reject) => {
    awsServerlessExpress.proxy(server, event, {
      ...context,
      succeed: resolve,
      fail: reject,
    });
  });
};
