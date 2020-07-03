import {Response} from 'express';
import {LogoService} from '../services';
import {constants as HttpStatusCodes} from 'http2';
import {controller, httpGet, queryParam, response} from 'inversify-express-utils';

@controller('/logo')
export class LogoController {
  private readonly logoService: LogoService;

  constructor(logoService: LogoService) {
    this.logoService = logoService;
  }

  @httpGet('/')
  public async get(@queryParam('brand-name') brandName: string, @response() response: Response): Promise<void> {
    // TODO - Validate brand-name
    const logo = await this.logoService.getFor(brandName);
    response
      .status(HttpStatusCodes.HTTP_STATUS_OK)
      .contentType(logo?.contentType as string)
      .send(logo?.logo);
  }
}
