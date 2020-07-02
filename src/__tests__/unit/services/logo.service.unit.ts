import {URL} from 'url';
import {expect} from 'chai';
import {instance, mock, when} from 'ts-mockito';
import {
  DomainLogoService,
  GoogleSearchService,
  LogoService,
} from '../../../services';

describe(LogoService.name, function () {
  const googleSearchService = mock(GoogleSearchService);
  const companyInsightsService = mock<DomainLogoService>();
  const logoService = new LogoService(
    instance(googleSearchService),
    instance(companyInsightsService),
  );

  it('should get logo for brand name', async function () {
    const logo = Buffer.of();
    const brandName = 'reddit';
    const url = new URL('https://reddit.com');
    when(googleSearchService.findWebsite(brandName)).thenResolve(url);
    when(companyInsightsService.companyLogo('reddit.com')).thenResolve(logo);

    const result = await logoService.getFor(brandName);

    expect(result).to.equal(logo);
  });

  it('should return undefined if URL is not found for brand name', async function () {
    const brandName = 'something';
    const url = undefined;
    when(googleSearchService.findWebsite(brandName)).thenResolve(url);

    const result = await logoService.getFor(brandName);

    expect(result).to.be.undefined;
  });
});
