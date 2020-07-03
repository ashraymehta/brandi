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
      const {buffer, contentType} = await this.s3Gateway.get(existingLogo.logoKey);
      return {logo: buffer, contentType: contentType};
    }

    const {logo, contentType} = await this.ritekitGateway.getCompanyLogo(domain);
    const key = `${Prefix.Logos}${domain}`;
    await this.s3Gateway.upload(logo, key, contentType);
    const domainLogo = new DomainLogo(domain, key);
    await this.domainLogoRepository.insert(domainLogo);

    return {logo, contentType};
  }
}
