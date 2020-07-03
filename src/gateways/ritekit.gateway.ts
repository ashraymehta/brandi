import {injectable} from 'inversify';
import {getLogger} from '../utils/logger.util';
import {ConfigUtil} from '../utils/config.util';
import superagent = require('superagent');

@injectable()
export class RitekitGateway {
  private readonly configUtil: ConfigUtil;
  private readonly logger = getLogger(RitekitGateway.name);

  constructor(configUtil: ConfigUtil) {
    this.configUtil = configUtil;
  }

  public async getCompanyLogo(domain: string): Promise<{logo: Buffer; contentType: string}> {
    const ritekitApiKey = await this.configUtil.getRitekitApiKey();
    const ritekitApiBaseUrl = await this.configUtil.getRitekitApiBaseUrl();
    this.logger.info(`Requesting logo for domain [${domain}] from [${ritekitApiBaseUrl}].`);
    const response = await superagent.get(
      `${ritekitApiBaseUrl}v1/images/logo/?client_id=${ritekitApiKey}&domain=${domain}`,
    );
    return {
      logo: response.body as Buffer,
      contentType: response.get('Content-Type'),
    };
  }
}
