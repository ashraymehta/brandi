import {Response} from 'express';
import {BrandService} from '../services';
import {constants as HttpStatusCodes} from 'http2';
import {controller, httpGet, queryParam, response} from 'inversify-express-utils';

@controller('/logo')
export class LogoController {
  private readonly brandService: BrandService;

  constructor(brandService: BrandService) {
    this.brandService = brandService;
  }

  @httpGet('/')
  public async get(@queryParam('brand-name') brandName: string, @response() response: Response): Promise<void> {
    // TODO - Validate brand-name
    const logo = await this.brandService.findLogoBy(brandName);
    response
      .status(HttpStatusCodes.HTTP_STATUS_OK)
      .contentType(logo?.contentType as string)
      .send(logo?.logo);
  }
}
