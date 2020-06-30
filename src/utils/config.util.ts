import fs = require('fs');
import process = require('process');
import {injectable} from 'inversify';

@injectable()
export class ConfigUtil {
  public async getRitekitApiKey(): Promise<string> {
    return process.env['RITEKIT_API_KEY'] as string;
  }
}
