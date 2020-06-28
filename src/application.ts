import {MySequence} from './sequence';
import {BootMixin} from '@loopback/boot';
import {customsearch_v1} from 'googleapis';
import {RestApplication} from '@loopback/rest';
import {ConfigUtil} from './utils/config.util';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {ServiceMixin} from '@loopback/service-proxy';
import {DependencyInjectionKeys} from './utils/dependency-injection.keys';
import Customsearch = customsearch_v1.Customsearch;

export {ApplicationConfig};

export class BrandiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.bind(DependencyInjectionKeys.CUSTOM_SEARCH).toClass(Customsearch);
    this.bind(DependencyInjectionKeys.CONFIG_UTIL).toClass(ConfigUtil);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
