import 'reflect-metadata';
import {getLogger} from './utils/logger.util';
import {AllSetupSteps} from './setup/all-setup.steps';
import {AddressInfo} from 'net';

const logger = getLogger(`Application`);

export async function main() {
  const {application} = await new AllSetupSteps().execute();
  const listener = application.listen(3000, () => {
    const port = (listener.address() as AddressInfo).port;
    logger.info(`Listening on [${port}].`);
  });
}

main().catch(err => {
  logger.error('Could not start the application.', err);
});
