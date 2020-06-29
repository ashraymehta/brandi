import {injectable} from 'inversify';

@injectable()
export class CompanyInsightsService {
  async companyLogo(domain: string): Promise<unknown> {
    throw new Error(`Not implemented yet`);
  }
}
