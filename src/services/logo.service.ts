import {injectable} from 'inversify';
import {GoogleSearchService} from './google-search.service';
import {CompanyInsightsService} from './company-insights.service';

@injectable()
export class LogoService {
  private readonly googleSearchService: GoogleSearchService;
  private readonly companyInsightsService: CompanyInsightsService;

  constructor(
    googleSearchService: GoogleSearchService,
    companyInsightsService: CompanyInsightsService,
  ) {
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
