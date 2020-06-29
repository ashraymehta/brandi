import {Request} from 'express';
import {getLogger} from '../utils/logger.util';
import JsonResult from 'inversify-express-utils/dts/results/JsonResult';
import {
  BaseHttpController,
  controller,
  httpGet,
  request,
} from 'inversify-express-utils';

@controller('/ping')
export class PingController extends BaseHttpController {
  private readonly logger = getLogger(PingController.name);

  @httpGet('/')
  public async ping(@request() req: Request): Promise<JsonResult> {
    this.logger.info(`Received ping request.`);
    return this.json({
      greeting: 'Hello!',
      date: new Date(),
      url: req.url,
      headers: Object.assign({}, req.headers),
    });
  }
}
