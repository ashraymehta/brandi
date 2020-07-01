import {Container} from 'inversify';
import {MongoClient} from 'mongodb';
import '../controllers/logo.controller';
import '../controllers/ping.controller';
import {ConfigUtil} from '../utils/config.util';
import {SetupData, SetupStep} from './setup.step';
import {customsearch_v1, google} from 'googleapis';
import Customsearch = customsearch_v1.Customsearch;

export class DependencyInjectionStep implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const container = new Container({autoBindInjectable: true});
    container
      .bind(Customsearch)
      .toDynamicValue(() => google.customsearch('v1'));

    container.bind(MongoClient).toProvider(() => {
      return async () => {
        const uri = await container.get(ConfigUtil).getMongoDbUri();
        return MongoClient.connect(uri);
      };
    });

    setupData.container = container;
  }
}
