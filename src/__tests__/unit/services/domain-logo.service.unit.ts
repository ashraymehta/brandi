import 'reflect-metadata';
import {expect} from 'chai';
import {DomainLogoService} from '../../../services';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {DomainLogo} from '../../../models/domain-logo.model';
import {RitekitGateway} from '../../../gateways/ritekit.gateway';
import {anything, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {DomainLogoRepository} from '../../../repositories/domain-logo.repository';

describe(DomainLogoService.name, () => {
  let s3Gateway: S3Gateway;
  let ritekitGateway: RitekitGateway;
  let domainLogoRepository: DomainLogoRepository;
  let domainLogoService: DomainLogoService;

  beforeEach(() => {
    s3Gateway = mock(S3Gateway);
    ritekitGateway = mock(RitekitGateway);
    domainLogoRepository = mock(DomainLogoRepository);
    domainLogoService = new DomainLogoService(
      instance(ritekitGateway),
      instance(domainLogoRepository),
      instance(s3Gateway),
    );
  });

  it('should save domain logo upon receiving it from RitekitGateway', async () => {
    const logoBuffer = Buffer.of();
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const key = `logos/${domain}`;
    when(ritekitGateway.getCompanyLogo(domain)).thenResolve({
      logo: logoBuffer,
      contentType: contentType,
    });
    when(s3Gateway.upload(logoBuffer, key, contentType)).thenResolve();

    const result = await domainLogoService.findLogo(domain);

    const expectedDomainLogo = new DomainLogo(domain, key);
    verify(domainLogoRepository.insert(deepEqual(expectedDomainLogo))).once();
    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });

  it('should find domain logo in DomainLogoRepository before contacting RitekitGateway', async () => {
    const logoBuffer = Buffer.of();
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const s3Url = 'https://s3-url.com/';
    const existingDomainLogo = new DomainLogo(domain, s3Url);
    when(domainLogoRepository.findByDomain(domain)).thenResolve(existingDomainLogo);
    when(s3Gateway.get(s3Url)).thenResolve({buffer: logoBuffer, contentType: contentType});

    const result = await domainLogoService.findLogo(domain);

    verify(ritekitGateway.getCompanyLogo(anything())).never();
    expect(result).to.deep.equal({logo: logoBuffer, contentType: contentType});
  });
});
