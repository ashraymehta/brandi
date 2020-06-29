import {Container} from 'inversify';
import '../controllers/logo.controller';
import '../controllers/ping.controller';
import {SetupData, SetupStep} from './setup.step';
import {customsearch_v1, google} from 'googleapis';
import Customsearch = customsearch_v1.Customsearch;

export class DependencyInjectionStep implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const container = new Container({autoBindInjectable: true});
    container
      .bind(Customsearch)
      .toDynamicValue(() => google.customsearch('v1'));

    setupData.container = container;
  }
}
