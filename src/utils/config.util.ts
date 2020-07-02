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

  public async getMongoDbUri(): Promise<string> {
    return process.env['MONGODB_URI'] as string;
  }

  public async getRitekitApiBaseUrl(): Promise<string> {
    return process.env['RITEKIT_API_BASE_URL'] as string;
  }

  public async getAWSAccessKeyId(): Promise<string | undefined> {
    return process.env['AWS_ACCESS_KEY_ID'];
  }

  public async getAWSSecretAccessKey(): Promise<string | undefined> {
    return process.env['AWS_SECRET_ACCESS_KEY'];
  }

  public async getAWSS3Endpoint(): Promise<string> {
    return process.env['AWS_S3_ENDPOINT'] as string;
  }
}
