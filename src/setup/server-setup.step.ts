import {Container} from 'inversify';
import {SetupData, SetupStep} from './setup.step';
import {InversifyExpressServer} from 'inversify-express-utils';
import passport = require('passport');

export class ServerStep implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    setupData.application = new InversifyExpressServer(setupData.container as Container)
      .setConfig(app => app.use(passport.initialize()))
      .build();
  }
}
