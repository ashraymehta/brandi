import {once} from 'events';
import {injectable} from 'inversify';
import {getLogger} from '../utils/logger.util';
import {ConfigUtil} from '../utils/config.util';
import {HttpClient} from 'typed-rest-client/HttpClient';

@injectable()
export class RitekitGateway {
  private readonly configUtil: ConfigUtil;
  private readonly logger = getLogger(RitekitGateway.name);

  constructor(configUtil: ConfigUtil) {
    this.configUtil = configUtil;
  }

  public async getCompanyLogo(domain: string) {
    const httpClient = new HttpClient(undefined);
    const ritekiteApiKey = await this.configUtil.getRitekitApiKey();
    this.logger.info(`Requesting logo for domain [${domain}].`);
    const clientResponse = await httpClient.get(
      `https://api.ritekit.com?client_id=${ritekiteApiKey}`,
    );
    return await once(clientResponse.message, 'data');
  }
}
