import {SetupData, SetupStep} from './setup.step';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {ConfigUtil} from '../utils/config.util';
import {randomBytes} from 'crypto';
import passport = require('passport');

export class PassportSetup implements SetupStep {
  async execute(setupData: SetupData): Promise<void> {
    const configUtil = setupData.container.get(ConfigUtil);
    const signingToken = await configUtil.getJwtSigningToken();
    var options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: signingToken ? signingToken : randomBytes(32),
    };
    passport.use(new Strategy(options, (_, done) => done(null, true)));
  }
}
