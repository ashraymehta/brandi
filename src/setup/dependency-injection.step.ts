import {Container} from 'inversify';
import {MongoClient} from 'mongodb';
import '../controllers/logo.controller';
import '../controllers/ping.controller';
import {ConfigUtil} from '../utils/config.util';
import {SetupData, SetupStep} from './setup.step';
import {customsearch_v1, google} from 'googleapis';
import AWS = require('aws-sdk');
import Customsearch = customsearch_v1.Customsearch;

export class DependencyInjectionStep implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const container = new Container({autoBindInjectable: true});
    container.bind(Customsearch).toDynamicValue(() => google.customsearch('v1'));

    const configUtil = container.get(ConfigUtil);
    const mongoDbUri = await configUtil.getMongoDbUri();
    container.bind(MongoClient).toProvider(() => () => MongoClient.connect(mongoDbUri));

    const endpoint = await configUtil.getAWSS3Endpoint();
    const accessKeyId = await configUtil.getAWSAccessKeyId();
    const secretAccessKey = await configUtil.getAWSSecretAccessKey();
    container.bind(AWS.S3).toDynamicValue(() => {
      return new AWS.S3({
        s3ForcePathStyle: true,
        endpoint: endpoint,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      });
    });

    setupData.container = container;
  }
}
