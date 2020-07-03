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

    container.bind(MongoClient).toProvider(() => {
      return async () => {
        const uri = await container.get(ConfigUtil).getMongoDbUri();
        return MongoClient.connect(uri);
      };
    });

    container.bind(AWS.S3).toProvider(() => {
      return async () => {
        const configUtil = container.get(ConfigUtil);
        return new AWS.S3({
          endpoint: await configUtil.getAWSS3Endpoint(),
          accessKeyId: await configUtil.getAWSAccessKeyId(),
          secretAccessKey: await configUtil.getAWSSecretAccessKey(),
        });
      };
    });

    setupData.container = container;
  }
}
