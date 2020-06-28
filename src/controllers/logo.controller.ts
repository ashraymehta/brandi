import {LogoService} from '../services';
import {service} from '@loopback/core';
import {get, param} from '@loopback/rest';

export class LogoController {
  private readonly logoService: LogoService;

  constructor(@service(LogoService) logoService: LogoService) {
    this.logoService = logoService;
  }

  @get('/logo')
  public async get(
    @param.query.number('brand-name') brandName: string,
  ): Promise<void> {
    // TODO - Validate brand-name
    this.logoService.getFor(brandName);
  }
}
