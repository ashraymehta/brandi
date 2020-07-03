import 'reflect-metadata';
import {DomainLogoService} from '../../../services';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {DomainLogo} from '../../../models/domain-logo.model';
import {RitekitGateway} from '../../../gateways/ritekit.gateway';
import {deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {DomainLogoRepository} from '../../../repositories/domain-logo.repository';

describe(DomainLogoService.name, () => {
  const s3Gateway = mock(S3Gateway);
  const ritekitGateway = mock(RitekitGateway);
  const domainLogoRepository = mock(DomainLogoRepository);

  const domainLogoService = new DomainLogoService(
    instance(ritekitGateway),
    instance(domainLogoRepository),
    instance(s3Gateway),
  );

  it('should save domain logo upon receiving it from RitekitGateway', async () => {
    const logoBuffer = Buffer.of();
    const domain = 'www.google.com';
    const contentType = 'image/png';
    const s3Url = 'https://s3-url.com/';
    when(ritekitGateway.getCompanyLogo(domain)).thenResolve({
      logo: logoBuffer,
      contentType: contentType,
    });
    when(s3Gateway.upload(logoBuffer, `logos/${domain}`)).thenResolve(s3Url);

    await domainLogoService.companyLogo(domain);

    verify(
      domainLogoRepository.insert(
        deepEqual(new DomainLogo(domain, s3Url, contentType)),
      ),
    ).once();
  });
});
