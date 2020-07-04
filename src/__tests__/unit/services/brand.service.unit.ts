import 'reflect-metadata';
import {URL} from 'url';
import {expect} from 'chai';
import {Brand} from '../../../models/brand.model';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {RitekitGateway} from '../../../gateways/ritekit.gateway';
import {BrandService, GoogleSearchService} from '../../../services';
import {BrandRepository} from '../../../repositories/brand.repository';
import {deepEqual, instance, mock, spy, verify, when} from 'ts-mockito';

describe(BrandService.name, () => {
  let s3Gateway: S3Gateway;
  let brandService: BrandService;
  let ritekitGateway: RitekitGateway;
  let brandRepository: BrandRepository;
  let googleSearchService: GoogleSearchService;

  beforeEach(() => {
    s3Gateway = mock(S3Gateway);
    ritekitGateway = mock(RitekitGateway);
    brandRepository = mock(BrandRepository);
    googleSearchService = mock(GoogleSearchService);
    brandService = new BrandService(
      instance(googleSearchService),
      instance(ritekitGateway),
      instance(brandRepository),
      instance(s3Gateway),
    );
  });

  it('should create brand', async () => {
    const logoBuffer = Buffer.of();
    const name = 'google';
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

    const createdBrand = await brandService.createBrandFor(name);

    const expectedBrand = new Brand(name, domain, key);
    expect(createdBrand).to.deep.equal(expectedBrand);
    verify(brandRepository.insert(deepEqual(expectedBrand))).once();
  });

  it('should create brand with lower-case name', async () => {
    const logoBuffer = Buffer.of();
    const name = 'Google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = `logos/${domain}`;
    const websiteUrl = new URL('https://www.google.com');
    when(googleSearchService.findWebsite(name.toLowerCase())).thenResolve(websiteUrl);
    when(ritekitGateway.getCompanyLogo(domain)).thenResolve({
      logo: logoBuffer,
      contentType: contentType,
    });
    when(s3Gateway.upload(logoBuffer, key, contentType)).thenResolve();

    const createdBrand = await brandService.createBrandFor(name);

    const expectedBrand = new Brand(name.toLowerCase(), domain, key);
    expect(createdBrand).to.deep.equal(expectedBrand);
    verify(brandRepository.insert(deepEqual(expectedBrand))).once();
  });

  it('should return undefined if not able to find domain for brand name', async () => {
    const name = 'Google';
    when(googleSearchService.findWebsite(name.toLowerCase())).thenResolve(undefined);

    const createdBrand = await brandService.createBrandFor(name);

    expect(createdBrand).to.be.undefined;
  });

  it('should find logo in DomainLogoRepository', async () => {
    const logoBuffer = Buffer.of();
    const name = 'google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = 'image-for-google';
    const existingBrand = new Brand(name, domain, key);
    when(brandRepository.findByName(name)).thenResolve(existingBrand);
    when(s3Gateway.get(key)).thenResolve({buffer: logoBuffer, contentType: contentType});

    const result = await brandService.findLogoBy(name);

    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });

  it('should convert name to lowercase before searching in DomainLogoRepository', async () => {
    const logoBuffer = Buffer.of();
    const name = 'Google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = 'image-for-google';
    const existingBrand = new Brand(name.toLowerCase(), domain, key);
    when(brandRepository.findByName(name.toLowerCase())).thenResolve(existingBrand);
    when(s3Gateway.get(key)).thenResolve({buffer: logoBuffer, contentType: contentType});

    const result = await brandService.findLogoBy(name);

    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });

  it('should create logo if not found', async () => {
    const logoBuffer = Buffer.of();
    const name = 'google';
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = 'image-for-google';
    const createdBrand = new Brand(name, domain, key);
    const spiedService = spy(brandService);
    when(spiedService.createBrandFor(name)).thenResolve(createdBrand);
    when(s3Gateway.get(key)).thenResolve({buffer: logoBuffer, contentType: contentType});

    const result = await brandService.findLogoBy(name);

    verify(spiedService.createBrandFor(name)).once();
    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });

  it('should return undefined if logo was not neither found nor created', async () => {
    const name = 'google';
    const spiedService = spy(brandService);
    when(spiedService.createBrandFor(name)).thenResolve(undefined);

    const result = await brandService.findLogoBy(name);

    expect(result).to.be.undefined;
  });
});
