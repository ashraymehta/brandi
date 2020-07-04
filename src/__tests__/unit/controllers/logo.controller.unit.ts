import 'reflect-metadata';
import {expect} from 'chai';
import {BrandService} from '../../../services';
import {createResponse} from 'node-mocks-http';
import {instance, mock, when} from 'ts-mockito';
import {constants as HttpStatusCodes} from 'http2';
import {LogoController} from '../../../controllers';

describe(LogoController.name, () => {
  const brandService = mock(BrandService);
  const controller = new LogoController(instance(brandService));

  it('should invoke logo service to get logo', async function () {
    const brandName = 'a-brand-name';
    const contentType = 'image/png';
    const response = createResponse();
    const logo = Buffer.of(10, 20);
    when(brandService.findLogoBy(brandName)).thenResolve({logo: logo, contentType: contentType});

    await controller.get(brandName, response);

    expect(response._isJSON()).to.be.false;
    expect(response._isEndCalled()).to.be.true;
    expect(response._getData()).to.deep.equal(logo);
    expect(response._getHeaders()['content-type']).to.equal(contentType);
    expect(response._getStatusCode()).to.equal(HttpStatusCodes.HTTP_STATUS_OK);
  });
});
