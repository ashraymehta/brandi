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

  it('should trim brand-name before querying logo service', async function () {
    const brandName = '  a-brand-name   ';
    const trimmedBrandName = 'a-brand-name';
    const contentType = 'image/png';
    const response = createResponse();
    const logo = Buffer.of(10, 20);
    when(brandService.findLogoBy(trimmedBrandName)).thenResolve({logo: logo, contentType: contentType});

    await controller.get(brandName, response);

    expect(response._isJSON()).to.be.false;
    expect(response._isEndCalled()).to.be.true;
    expect(response._getData()).to.deep.equal(logo);
    expect(response._getHeaders()['content-type']).to.equal(contentType);
    expect(response._getStatusCode()).to.equal(HttpStatusCodes.HTTP_STATUS_OK);
  });

  it('should result in a not-found if logo was not found', async function () {
    const brandName = 'a-brand-name';
    const response = createResponse();
    when(brandService.findLogoBy(brandName)).thenResolve(undefined);

    await controller.get(brandName, response);

    expect(response._isJSON()).to.be.false;
    expect(response._isEndCalled()).to.be.true;
    expect(response._getData()).to.be.empty;
    expect(response._getStatusCode()).to.equal(HttpStatusCodes.HTTP_STATUS_NOT_FOUND);
  });

  it('should result in a bad request if brand name is not present in query params', async function () {
    const response = createResponse();

    await controller.get(<any>undefined, response);

    expect(response._isJSON()).to.be.true;
    expect(response._isEndCalled()).to.be.true;
    expect(response._getStatusCode()).to.equal(HttpStatusCodes.HTTP_STATUS_BAD_REQUEST);
    expect(response._getJSONData()).to.deep.equal({errors: ['Query parameter brand-name is invalid.']});
  });

  it('should result in a bad request if brand name is longer than 50 characters', async function () {
    const response = createResponse();

    await controller.get('123456789012345678901234567890123456789012345678901', response);

    expect(response._isJSON()).to.be.true;
    expect(response._isEndCalled()).to.be.true;
    expect(response._getStatusCode()).to.equal(HttpStatusCodes.HTTP_STATUS_BAD_REQUEST);
    expect(response._getJSONData()).to.deep.equal({errors: ['Query parameter brand-name is invalid.']});
  });

  it('should result in a bad request if brand name is 50 characters long', async function () {
    const brandName = 'a-brand-name';
    const contentType = 'image/png';
    const response = createResponse();
    when(brandService.findLogoBy('12345678901234567890123456789012345678901234567890')).thenResolve({
      logo: Buffer.of(10, 20),
      contentType: contentType,
    });

    await controller.get(brandName, response);

    expect(response._isEndCalled()).to.be.true;
    expect(response._getStatusCode()).to.not.equal(HttpStatusCodes.HTTP_STATUS_BAD_REQUEST);
  });
});
