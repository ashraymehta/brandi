import 'reflect-metadata';
import {expect} from 'chai';
import {instance, mock, when} from 'ts-mockito';
import {BrandService, LogoService} from '../../../services';

describe(LogoService.name, function () {
  const brandService = mock<BrandService>();
  const logoService = new LogoService(instance(brandService));

  it('should get logo for brand name', async function () {
    const logo = Buffer.of();
    const brandName = 'reddit';
    when(brandService.findLogo(brandName)).thenResolve({logo, contentType: 'image/png'});

    const result = await logoService.getFor(brandName);

    expect(result).to.deep.equal({logo, contentType: 'image/png'});
  });
});
