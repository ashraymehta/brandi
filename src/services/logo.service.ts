import {injectable} from 'inversify';
import {BrandService} from './brand.service';
import {GoogleSearchService} from './google-search.service';

@injectable()
export class LogoService {
  private readonly googleSearchService: GoogleSearchService;
  private readonly brandService: BrandService;

  constructor(brandService: BrandService, googleSearchService: GoogleSearchService) {
    this.googleSearchService = googleSearchService;
    this.brandService = brandService;
  }

  async getFor(brandName: string): Promise<{logo: Buffer; contentType: string} | null> {
    const url = await this.googleSearchService.findWebsite(brandName);
    if (url) {
      return await this.brandService.findLogo(url.host);
    } else {
      return null;
    }
  }
}
