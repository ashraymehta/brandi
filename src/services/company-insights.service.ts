import {injectable} from 'inversify';
import {RitekitGateway} from '../gateways/ritekit.gateway';

@injectable()
export class CompanyInsightsService {
  private readonly ritekitGateway: RitekitGateway;

  constructor(ritekitGateway: RitekitGateway) {
    this.ritekitGateway = ritekitGateway;
  }

  async companyLogo(domain: string): Promise<unknown> {
    return this.ritekitGateway.getCompanyLogo(domain);
  }
}
