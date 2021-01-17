import {SetupData, SetupStep} from './setup.step';
import {getLogger} from '../utils/logger.util';
import {GoogleSignInTokenVerifier} from '../controllers/authentication/google-sign-in-verifier';
import passport = require('passport');
const BearerStrategy = require('passport-http-bearer');

export class PassportSetup implements SetupStep {
  private static readonly logger = getLogger(PassportSetup.name);

  async execute(setupData: SetupData): Promise<void> {
    passport.use(
      new BearerStrategy(function (token: string, done: any) {
        const verifier = setupData.container.get(GoogleSignInTokenVerifier);
        verifier
          .verify(token)
          .then(() => {
            PassportSetup.logger.info(`Authentication successful.`);
            done(null, true);
          })
          .catch(err => {
            PassportSetup.logger.info(`Authentication failed with error: ${err.stack}`);
            done(null, false);
          });
      }),
    );
  }
}
