import {injectable} from 'inversify';

@injectable()
export class RemoveBgGateway {
  async removeBackground(image: Buffer): Promise<Buffer> {
    throw new Error(`Not yet implemented.`);
  }
}
