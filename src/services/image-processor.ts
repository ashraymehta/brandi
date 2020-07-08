import sharp = require('sharp');
import {injectable} from 'inversify';
import {getLogger} from '../utils/logger.util';
import {RemoveBgGateway} from '../gateways/remove-bg.gateway';

@injectable()
export class ImageProcessor {
  private readonly removeBgGateway: RemoveBgGateway;
  private readonly logger = getLogger(ImageProcessor.name);

  constructor(removeBgGateway: RemoveBgGateway) {
    this.removeBgGateway = removeBgGateway;
  }

  public async process(buffer: Buffer, contentType: string): Promise<{image: Buffer; contentType: string}> {
    const stats = await sharp(buffer).stats();
    if (!stats.isOpaque) return {image: buffer, contentType};

    this.logger.info(`Image is detected to be opaque. Requesting background removal.`);
    return await this.removeBgGateway.removeBackground(buffer);
  }
}
