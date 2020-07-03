import 'reflect-metadata';
import {URL} from 'url';
import {expect} from 'chai';
import {instance, mock, when} from 'ts-mockito';
import {DomainLogoService, GoogleSearchService, LogoService} from '../../../services';

describe(LogoService.name, function () {
  const domainLogoService = mock<DomainLogoService>();
  const googleSearchService = mock<GoogleSearchService>();
  const logoService = new LogoService(instance(googleSearchService), instance(domainLogoService));

  it('should get logo for brand name', async function () {
    const logo = Buffer.of();
    const brandName = 'reddit';
    const domain = 'reddit.com';
    const url = new URL('https://reddit.com');
    when(googleSearchService.findWebsite(brandName)).thenResolve(url);
    when(domainLogoService.findLogo(domain)).thenResolve({logo, contentType: 'image/png'});

    const result = await logoService.getFor(brandName);

    expect(result).to.deep.equal({logo, contentType: 'image/png'});
  });

  it('should return null if URL is not found for brand name', async function () {
    const brandName = 'something';
    const url = undefined;
    when(googleSearchService.findWebsite(brandName)).thenResolve(url);

    const result = await logoService.getFor(brandName);

    expect(result).to.be.null;
  });
});
