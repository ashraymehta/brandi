import 'reflect-metadata';
import {URL} from 'url';
import {expect} from 'chai';
import {Brand} from '../../../models/brand.model';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {RitekitGateway} from '../../../gateways/ritekit.gateway';
import {BrandService, GoogleSearchService} from '../../../services';
import {BrandRepository} from '../../../repositories/brand.repository';
import {anything, deepEqual, instance, mock, verify, when} from 'ts-mockito';

describe(BrandService.name, () => {
  let s3Gateway: S3Gateway;
  let ritekitGateway: RitekitGateway;
  let domainLogoService: BrandService;
  let domainLogoRepository: BrandRepository;
  let googleSearchService: GoogleSearchService;

  beforeEach(() => {
    s3Gateway = mock(S3Gateway);
    ritekitGateway = mock(RitekitGateway);
    domainLogoRepository = mock(BrandRepository);
    googleSearchService = mock(GoogleSearchService);
    domainLogoService = new BrandService(
      instance(googleSearchService),
      instance(ritekitGateway),
      instance(domainLogoRepository),
      instance(s3Gateway),
    );
  });

  it('should save logo upon receiving it from RitekitGateway', async () => {
    const logoBuffer = Buffer.of();
    const name = 'Google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = `logos/${domain}`;
    const websiteUrl = new URL('https://www.google.com');
    when(googleSearchService.findWebsite(name)).thenResolve(websiteUrl);
    when(ritekitGateway.getCompanyLogo(domain)).thenResolve({
      logo: logoBuffer,
      contentType: contentType,
    });
    when(s3Gateway.upload(logoBuffer, key, contentType)).thenResolve();

    const result = await domainLogoService.findLogo(name);

    const expectedDomainLogo = new Brand(name, domain, key);
    verify(domainLogoRepository.insert(deepEqual(expectedDomainLogo))).once();
    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });

  it('should find logo in DomainLogoRepository before building it', async () => {
    const logoBuffer = Buffer.of();
    const name = 'Google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const s3Url = 'https://s3-url.com/';
    const existingDomainLogo = new Brand(name, domain, s3Url);
    const websiteUrl = new URL('https://www.google.com');
    when(googleSearchService.findWebsite(name)).thenResolve(websiteUrl);
    when(domainLogoRepository.findByName(domain)).thenResolve(existingDomainLogo);
    when(s3Gateway.get(s3Url)).thenResolve({buffer: logoBuffer, contentType: contentType});

    const result = await domainLogoService.findLogo(name);

    verify(ritekitGateway.getCompanyLogo(anything())).never();
    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });
});
