import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {RitekitDataSource} from '../datasources';

/**
 * The service interface is generated from OpenAPI spec with operations tagged
 * by Company Insights.
 */
export interface CompanyInsightsService {
  /**
   * Returns a company logo based on website domain. If the logo is not in our
database yet, it will be extracted from the site on the fly. White logo
background is automatically removed to make the logo look better on color
backgrounds. Note: It is not possible to access our company logo API
publicly without authentication. If you wish to do so, you have to create a
proxy on your own server that calls our API from the server side.
   * @param domain Hostname without http://
   */
  companyLogo(domain: string): Promise<unknown>;
}

export class CompanyInsightsServiceProvider
  implements Provider<CompanyInsightsService> {
  constructor(
    // ritekit must match the name property in the datasource json file
    @inject('datasources.ritekit')
    protected dataSource: RitekitDataSource = new RitekitDataSource(),
  ) {}

  async value(): Promise<CompanyInsightsService> {
    const service = await getService<{
      apis: {'Company Insights': CompanyInsightsService};
    }>(this.dataSource);
    return service.apis['Company Insights'];
  }
}
