import {injectable} from 'inversify';
import {ConfigUtil} from '../utils/config.util';
import {removeBackgroundFromImageBase64, RemoveBgBase64Options, RemoveBgResult} from 'remove.bg';

@injectable()
export class RemoveBgGateway {
  private readonly configUtil: ConfigUtil;

  constructor(configUtil: ConfigUtil) {
    this.configUtil = configUtil;
  }

  async removeBackground(image: Buffer): Promise<{image: Buffer; contentType: string}> {
    const removeBgResult = await this._removeBackground({
      format: 'png',
      base64img: image.toString('base64'),
      apiKey: await this.configUtil.getRemoveBgApiKey(),
    });
    return {image: Buffer.from(removeBgResult.base64img, 'base64'), contentType: 'image/png'};
  }

  async _removeBackground(removeBgBase64Options: RemoveBgBase64Options): Promise<RemoveBgResult> {
    return await removeBackgroundFromImageBase64(removeBgBase64Options);
  }
}
