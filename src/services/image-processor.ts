import sharp = require('sharp');
import {injectable} from 'inversify';
import {RemoveBgGateway} from '../gateways/remove-bg.gateway';

@injectable()
export class ImageProcessor {
  private readonly removeBgGateway: RemoveBgGateway;

  constructor(removeBgGateway: RemoveBgGateway) {
    this.removeBgGateway = removeBgGateway;
  }

  public async process(buffer: Buffer, contentType: string): Promise<{image: Buffer; contentType: string}> {
    const stats = await sharp(buffer).stats();
    if (!stats.isOpaque) return {image: buffer, contentType};
    return await this.removeBgGateway.removeBackground(buffer);
  }
}
