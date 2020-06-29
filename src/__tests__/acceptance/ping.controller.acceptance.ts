import {Server} from 'http';
import {once} from 'events';
import {expect} from 'chai';
import {constants} from 'http2';
import {Application} from 'express';
import {startApplication} from './test-helper';
import supertest = require('supertest');
import HTTP_STATUS_OK = constants.HTTP_STATUS_OK;

describe('PingController', () => {
  let server: Server;
  let app: Application;

  before('setupApplication', async () => {
    const startedApp = await startApplication();
    server = startedApp.server;
    app = startedApp.app;
  });

  after(async () => {
    await once(server.close(), 'close');
  });

  it('invokes GET /ping', async () => {
    const response = await supertest(app).get('/ping').expect(HTTP_STATUS_OK);
    expect(response.body.greeting).to.equal('Hello!');
  });
});
