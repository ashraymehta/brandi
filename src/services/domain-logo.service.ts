import {injectable} from 'inversify';
import {S3Gateway} from '../gateways/s3.gateway';
import {DomainLogo} from '../models/domain-logo.model';
import {RitekitGateway} from '../gateways/ritekit.gateway';
import {DomainLogoRepository} from '../repositories/domain-logo.repository';

@injectable()
export class DomainLogoService {
  private readonly s3Gateway: S3Gateway;
  private readonly ritekitGateway: RitekitGateway;
  private readonly domainLogoRepository: DomainLogoRepository;

  constructor(
    ritekitGateway: RitekitGateway,
    domainLogoRepository: DomainLogoRepository,
    s3Gateway: S3Gateway,
  ) {
    this.domainLogoRepository = domainLogoRepository;
    this.s3Gateway = s3Gateway;
    this.ritekitGateway = ritekitGateway;
  }

  async companyLogo(domain: string): Promise<unknown> {
    const {logo, contentType} = await this.ritekitGateway.getCompanyLogo(
      domain,
    );
    const logoUrl = await this.s3Gateway.upload(logo);
    await this.domainLogoRepository.insert(
      new DomainLogo(domain, logoUrl, contentType),
    );
    return logo;
  }
}
