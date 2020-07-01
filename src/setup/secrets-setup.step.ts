import {google} from 'googleapis';
import {ConfigUtil} from '../utils/config.util';
import {SetupData, SetupStep} from './setup.step';

export class SecretsSetupStep implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const configUtil = setupData.container.get(ConfigUtil);
    google.options({auth: await configUtil.getGoogleSearchApiKey()});
  }
}
