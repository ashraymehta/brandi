import {Container} from 'inversify';
import {MongoClient} from 'mongodb';
import '../controllers/logo.controller';
import '../controllers/ping.controller';
import {getLogger} from '../utils/logger.util';
import {ConfigUtil} from '../utils/config.util';
import {SetupData, SetupStep} from './setup.step';
import {customsearch_v1, google} from 'googleapis';
import {ClientConfiguration} from 'aws-sdk/clients/s3';
import AWS = require('aws-sdk');
import Customsearch = customsearch_v1.Customsearch;

export class DependencyInjectionStep implements SetupStep {
  private readonly logger = getLogger(DependencyInjectionStep.name);

  async execute(setupData: SetupData): Promise<void> {
    const container = new Container({autoBindInjectable: true});
    container.bind(Customsearch).toDynamicValue(() => google.customsearch('v1'));

    const configUtil = container.get(ConfigUtil);
    const mongoDbUri = await configUtil.getMongoDbUri();
    container.bind(MongoClient).toProvider(() => () => MongoClient.connect(mongoDbUri));

    await this.configureS3(configUtil, container);

    setupData.container = container;
  }

  private async configureS3(configUtil: ConfigUtil, container: Container) {
    const config = <ClientConfiguration>{s3ForcePathStyle: true};
    if (await configUtil.getAWSS3Endpoint()) {
      this.logger.debug(`Found AWS S3 endpoint configuration.`);
      config.endpoint = await configUtil.getAWSS3Endpoint();
    }
    if (await configUtil.getOverriddenAWSAccessKeyId()) {
      this.logger.debug(`Found AWS Access Key Id configuration.`);
      config.accessKeyId = await configUtil.getOverriddenAWSAccessKeyId();
    }
    if (await configUtil.getOverriddenAWSSecretAccessKey()) {
      this.logger.debug(`Found AWS Secret Access Key configuration.`);
      config.secretAccessKey = await configUtil.getOverriddenAWSSecretAccessKey();
    }

    this.logger.debug(`Prepared AWS S3 config.`);
    container.bind(AWS.S3).toDynamicValue(() => new AWS.S3(config));
  }
}
