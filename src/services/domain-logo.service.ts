import {injectable} from 'inversify';
import {Prefix, S3Gateway} from '../gateways/s3.gateway';
import {DomainLogo} from '../models/domain-logo.model';
import {RitekitGateway} from '../gateways/ritekit.gateway';
import {DomainLogoRepository} from '../repositories/domain-logo.repository';

@injectable()
export class DomainLogoService {
  private readonly s3Gateway: S3Gateway;
  private readonly ritekitGateway: RitekitGateway;
  private readonly domainLogoRepository: DomainLogoRepository;

  constructor(ritekitGateway: RitekitGateway, domainLogoRepository: DomainLogoRepository, s3Gateway: S3Gateway) {
    this.domainLogoRepository = domainLogoRepository;
    this.s3Gateway = s3Gateway;
    this.ritekitGateway = ritekitGateway;
  }

  async findLogo(domain: string): Promise<{logo: Buffer; contentType: string}> {
    const existingLogo = await this.domainLogoRepository.findByDomain(domain);

    if (existingLogo) {
      return {
        logo: (await this.s3Gateway.get(existingLogo.logoUrl)) as Buffer,
        contentType: existingLogo.contentType,
      };
    }

    const {logo, contentType} = await this.ritekitGateway.getCompanyLogo(domain);
    const logoUrl = await this.s3Gateway.upload(logo, `${Prefix.Logos}${domain}`);
    const domainLogo = new DomainLogo(domain, logoUrl, contentType);
    await this.domainLogoRepository.insert(domainLogo);

    return {logo, contentType};
  }
}
