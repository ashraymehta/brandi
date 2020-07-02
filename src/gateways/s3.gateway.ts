import {injectable} from 'inversify';

@injectable()
export class S3Gateway {
  async upload(buffer: Buffer): Promise<string> {
    throw new Error(`Not implemented yet.`);
  }
}
