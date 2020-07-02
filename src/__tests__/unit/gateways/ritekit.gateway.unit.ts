import 'reflect-metadata';
import {expect} from 'chai';
import {constants} from 'http2';
import {instance, mock, when} from 'ts-mockito';
import {ConfigUtil} from '../../../utils/config.util';
import {RitekitGateway} from '../../../gateways/ritekit.gateway';
import fs = require('fs');
import nock = require('nock');
import path = require('path');
import HTTP_STATUS_OK = constants.HTTP_STATUS_OK;

describe(RitekitGateway.name, () => {
  const configUtil = mock(ConfigUtil);
  const ritekitGateway = new RitekitGateway(instance(configUtil));

  it('should request logo from ritekit', async () => {
    const baseUrl = 'https://api.ritekit.com/';
    const domain = 'www.google.com';
    const ritekitApiKey = 'ritekit-api-key';
    when(configUtil.getRitekitApiBaseUrl()).thenResolve(baseUrl);
    when(configUtil.getRitekitApiKey()).thenResolve(ritekitApiKey);
    const imageFilename = path.join(
      __dirname,
      '../../resources/random-image.jpg',
    );
    nock(baseUrl)
      .get('/v1/images/logo/')
      .query({
        client_id: ritekitApiKey,
        domain: domain,
      })
      .replyWithFile(HTTP_STATUS_OK, imageFilename, {
        'Content-Type': 'image/jpg',
        'Transfer-Encoding': 'chunked',
      });

    const {logo, contentType} = await ritekitGateway.getCompanyLogo(
      'www.google.com',
    );

    const imageBuffer = fs.readFileSync(imageFilename);
    expect(logo).to.deep.equal(imageBuffer);
    expect(contentType).to.deep.equal('image/jpg');
  });
});
