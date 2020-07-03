import {S3} from 'aws-sdk';
import {injectable} from 'inversify';
import {ConfigUtil} from '../utils/config.util';

@injectable()
export class S3Gateway {
  private readonly s3: S3;
  private readonly configUtil: ConfigUtil;

  constructor(s3: S3, configUtil: ConfigUtil) {
    this.s3 = s3;
    this.configUtil = configUtil;
  }

  public async upload(buffer: Buffer, key: string): Promise<string> {
    const s3BucketName = await this.configUtil.getS3BucketName();
    const {Location} = await this.s3.upload({Key: key, Bucket: s3BucketName, Body: buffer}).promise();
    return Location;
  }
}

export enum Prefix {
  Logos = 'logos/',
}
