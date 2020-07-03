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

  async getFor(brandName: string): Promise<Buffer | undefined> {
    const url = await this.googleSearchService.findWebsite(brandName);
    if (url) {
      return <Buffer>await this.companyInsightsService.companyLogo(url.host);
    } else {
      return undefined;
    }
  }
}
