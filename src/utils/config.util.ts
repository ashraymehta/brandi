import process = require('process');
import {injectable} from 'inversify';

@injectable()
export class ConfigUtil {
  public async getRitekitApiKey(): Promise<string> {
    return process.env['RITEKIT_API_KEY'] as string;
  }

  public async getGoogleSearchApiKey(): Promise<string> {
    return process.env['GOOGLE_SEARCH_API_KEY'] as string;
  }

  public async getGoogleSearchEngineId(): Promise<string> {
    return process.env['GOOGLE_SEARCH_ENGINE_ID'] as string;
  }
}
