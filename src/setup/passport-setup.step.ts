import {SetupData, SetupStep} from './setup.step';
import {getLogger} from '../utils/logger.util';
import passport = require('passport');
import {Strategy, ExtractJwt} from 'passport-jwt';
import {ConfigUtil} from '../utils/config.util';

export class PassportSetup implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const configUtil = setupData.container.get(ConfigUtil);
    var options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: await configUtil.getJwtSigningToken(),
    };
    passport.use(new Strategy(options, (_, done) => done(null, true)));
  }
}
