import {Response} from 'express';
import {BrandService} from '../services';
import {constants as HttpStatusCodes} from 'http2';
import authenticationMiddleware from './authentication/authentication.middleware';
import {controller, httpGet, queryParam, response} from 'inversify-express-utils';
import {getLogger} from '../utils/logger.util';

@controller('/logo', authenticationMiddleware())
export class LogoController {
  private readonly brandService: BrandService;
  private readonly logger = getLogger(LogoController.name);

  constructor(brandService: BrandService) {
    this.brandService = brandService;
  }

  @httpGet('/')
  public async get(@queryParam('brand-name') brandName: string, @response() response: Response): Promise<void> {
    if (!brandName || brandName.length > 50) {
      response
        .status(HttpStatusCodes.HTTP_STATUS_BAD_REQUEST)
        .json({errors: ['Query parameter brand-name is invalid.']})
        .end();
      return;
    }

    const logo = await this.brandService.findLogoBy(brandName.trim());
    if (!logo) {
      this.logger.info(`Could not find the logo for brand [${brandName}].`);
      response.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).end();
      return;
    }

    this.logger.info(`Found the logo for brand [${brandName}]. Returning it.`);

    response
      .status(HttpStatusCodes.HTTP_STATUS_OK)
      .contentType(logo?.contentType as string)
      .send(logo?.logo);
  }
}
