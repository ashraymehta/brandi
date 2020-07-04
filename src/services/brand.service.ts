import {injectable} from 'inversify';
import {Brand} from '../models/brand.model';
import {Prefix, S3Gateway} from '../gateways/s3.gateway';
import {RitekitGateway} from '../gateways/ritekit.gateway';
import {GoogleSearchService} from './google-search.service';
import {BrandRepository} from '../repositories/brand.repository';

@injectable()
export class BrandService {
  private readonly s3Gateway: S3Gateway;
  private readonly ritekitGateway: RitekitGateway;
  private readonly brandRepository: BrandRepository;
  private readonly googleSearchService: GoogleSearchService;

  constructor(
    googleSearchService: GoogleSearchService,
    ritekitGateway: RitekitGateway,
    brandRepository: BrandRepository,
    s3Gateway: S3Gateway,
  ) {
    this.googleSearchService = googleSearchService;
    this.brandRepository = brandRepository;
    this.s3Gateway = s3Gateway;
    this.ritekitGateway = ritekitGateway;
  }

  async findLogo(name: string): Promise<{logo: Buffer; contentType: string}> {
    const existingLogo = await this.brandRepository.findByName(name);
    if (existingLogo) {
      const {buffer, contentType} = await this.s3Gateway.get(existingLogo.logoKey);
      return {logo: buffer, contentType: contentType};
    }

    const url = await this.googleSearchService.findWebsite(name);
    if (!url) {
      throw new Error(`Not implemented yet.`);
    }
    const domain = url.host;

    const {logo, contentType} = await this.ritekitGateway.getCompanyLogo(domain);
    const key = `${Prefix.Logos}${domain}`;
    await this.s3Gateway.upload(logo, key, contentType);
    const domainLogo = new Brand(name, domain, key);
    await this.brandRepository.insert(domainLogo);

    return {logo, contentType};
  }
}
