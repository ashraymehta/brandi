import fs = require('fs');
import process = require('process');
import {injectable} from 'inversify';

@injectable()
export class ConfigUtil {
  public async getRitekitApiKey(): Promise<string> {
    const configFilePath = process.env['RITEKIT_CONFIG'] as string;
    if (configFilePath) {
      const ritekitConfig = JSON.parse(
        fs.readFileSync(configFilePath, {encoding: 'utf-8'}),
      );
      return ritekitConfig.apiKey;
    } else {
      return '';
    }
  }
}
