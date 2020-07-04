import {injectable} from 'inversify';
import {Brand} from '../models/brand.model';
import {getLogger} from '../utils/logger.util';
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
  private readonly logger = getLogger(BrandService.name);

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

  async findLogoBy(name: string): Promise<{logo: Buffer; contentType: string} | undefined> {
    name = name.toLowerCase();
    const existingBrand = await this.brandRepository.findByName(name);
    if (existingBrand) {
      this.logger.info(`Found existing brand-info for brand-name [${name}].`);
      const {buffer, contentType} = await this.s3Gateway.get(existingBrand.logoKey);
      return {logo: buffer, contentType: contentType};
    }

    this.logger.info(`Could not find existing brand-info for brand-name [${name}]. Trying to created one now...`);

    const brand = await this.createBrandFor(name);
    if (!brand) return undefined;

    const {buffer, contentType} = await this.s3Gateway.get(brand.logoKey);
    return {logo: buffer, contentType: contentType};
  }

  async createBrandFor(name: string): Promise<Brand | undefined> {
    name = name.toLowerCase();
    const url = await this.googleSearchService.findWebsite(name);
    if (!url) return undefined;

    const domain = url.host;
    const {logo, contentType} = await this.ritekitGateway.getCompanyLogo(domain);

    const key = `${Prefix.Logos}${domain}`;
    await this.s3Gateway.upload(logo, key, contentType);

    const brand = new Brand(name, domain, key);
    await this.brandRepository.insert(brand);

    this.logger.info(`Saved brand information for brand-name [${name}].`);
    return brand;
  }
}
