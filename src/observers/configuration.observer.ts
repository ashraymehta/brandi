import {
  Application,
  CoreBindings,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import {ConfigUtil} from '../utils/config.util';
import {RitekitDataSource} from '../datasources';
import {DependencyInjectionKeys} from '../utils/dependency-injection.keys';

@lifeCycleObserver('')
export class ConfigurationObserver implements LifeCycleObserver {
  private readonly app: Application;
  private readonly configUtil: ConfigUtil;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(DependencyInjectionKeys.CONFIG_UTIL) configUtil: ConfigUtil,
  ) {
    this.configUtil = configUtil;
    this.app = app;
  }

  async start(): Promise<void> {
    const ritekitApiKey = this.configUtil.getRitekitApiKey();
    this.app.bind('datasources.config.ritekit').to({
      ...RitekitDataSource.defaultConfig,
      authorizations: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: ritekitApiKey,
      },
    });
  }

  async stop(): Promise<void> {}
}
