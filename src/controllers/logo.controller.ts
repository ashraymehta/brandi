import {LogoService} from '../services';
import {controller, httpGet, queryParam} from 'inversify-express-utils';

@controller('/logo')
export class LogoController {
  private readonly logoService: LogoService;

  constructor(logoService: LogoService) {
    this.logoService = logoService;
  }

  @httpGet('/')
  public async get(@queryParam('brand-name') brandName: string): Promise<void> {
    // TODO - Validate brand-name
    await this.logoService.getFor(brandName);
  }
}
