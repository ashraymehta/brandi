import {injectable} from 'inversify';
import {DomainLogoService} from './domain-logo.service';
import {GoogleSearchService} from './google-search.service';

@injectable()
export class LogoService {
  private readonly googleSearchService: GoogleSearchService;
  private readonly companyInsightsService: DomainLogoService;

  constructor(googleSearchService: GoogleSearchService, companyInsightsService: DomainLogoService) {
    this.googleSearchService = googleSearchService;
    this.companyInsightsService = companyInsightsService;
  }

  async getFor(brandName: string): Promise<{logo: Buffer; contentType: string} | null> {
    const url = await this.googleSearchService.findWebsite(brandName);
    if (url) {
      return await this.companyInsightsService.findLogo(url.host);
    } else {
      return null;
    }
  }
}
