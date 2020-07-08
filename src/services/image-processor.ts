import sharp = require('sharp');
import {injectable} from 'inversify';
import {RemoveBgGateway} from '../gateways/remove-bg.gateway';

@injectable()
export class ImageProcessor {
  private readonly removeBgGateway: RemoveBgGateway;

  constructor(removeBgGateway: RemoveBgGateway) {
    this.removeBgGateway = removeBgGateway;
  }

  public async process(buffer: Buffer) {
    const stats = await sharp(buffer).stats();
    if (!stats.isOpaque) return buffer;
    return await this.removeBgGateway.removeBackground(buffer);
  }
}
