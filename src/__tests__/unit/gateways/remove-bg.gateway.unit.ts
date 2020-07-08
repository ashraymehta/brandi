import 'reflect-metadata';
import {expect} from 'chai';
import {RemoveBgResult} from 'remove.bg';
import {ConfigUtil} from '../../../utils/config.util';
import {deepEqual, instance, mock, spy, when} from 'ts-mockito';
import {RemoveBgGateway} from '../../../gateways/remove-bg.gateway';
import fs = require('fs');
import path = require('path');

describe(RemoveBgGateway.name, () => {
  const configUtil = mock(ConfigUtil);
  const removeBgGateway = new RemoveBgGateway(instance(configUtil));

  it('should request background removal from remove.bg', async () => {
    const apiKey = 'api-key';
    when(configUtil.getRemoveBgApiKey()).thenResolve(apiKey);
    const opaqueImage = fs.readFileSync(path.join(__dirname, '../../resources/opaque-image.jpg'));
    const opaqueImageAsBase64 = opaqueImage.toString('base64');
    const transparentImage = fs.readFileSync(path.join(__dirname, '../../resources/transparent-image.png'));
    const spiedGateway = spy(removeBgGateway);
    when(spiedGateway._removeBackground(deepEqual({apiKey, base64img: opaqueImageAsBase64}))).thenResolve({
      base64img: transparentImage.toString('base64'),
    } as RemoveBgResult);

    const result = await removeBgGateway.removeBackground(opaqueImage);

    expect(result).to.deep.equal(transparentImage);
  });
});
