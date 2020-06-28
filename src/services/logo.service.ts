import {bind, BindingScope, service} from '@loopback/core';
import {GoogleSearchService} from './google-search.service';
import {CompanyInsightsService} from './company-insights.service';

@bind({scope: BindingScope.TRANSIENT})
export class LogoService {
  private readonly googleSearchService: GoogleSearchService;
  private readonly companyInsightsService: CompanyInsightsService;

  constructor(
    @service() googleSearchService: GoogleSearchService,
    @service() companyInsightsService: CompanyInsightsService,
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
