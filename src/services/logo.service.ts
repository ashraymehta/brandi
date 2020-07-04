import {injectable} from 'inversify';
import {BrandService} from './brand.service';

// TODO - Remove this proxy class
@injectable()
export class LogoService {
  private readonly brandService: BrandService;

  constructor(brandService: BrandService) {
    this.brandService = brandService;
  }

  async getFor(brandName: string): Promise<{logo: Buffer; contentType: string} | null> {
    return await this.brandService.findLogoBy(brandName);
  }
}
