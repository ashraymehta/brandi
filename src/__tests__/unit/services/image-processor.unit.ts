import 'reflect-metadata';
import * as fs from 'fs';
import {expect} from 'chai';
import * as path from 'path';
import {instance, mock, when} from 'ts-mockito';
import {ImageProcessor} from '../../../services/image-processor';
import {RemoveBgGateway} from '../../../gateways/remove-bg.gateway';

describe(ImageProcessor.name, () => {
  const removeBgGateway = mock(RemoveBgGateway);
  const imageProcessor = new ImageProcessor(instance(removeBgGateway));

  it('should return the image if it is not opaque', async () => {
    const opaqueImage = fs.readFileSync(path.join(__dirname, '../../resources/transparent-image.png'));

    const processedImage = await imageProcessor.process(opaqueImage);

    expect(processedImage).to.equal(opaqueImage);
  });

  it('should invoke remove.bg gateway if image is opaque', async () => {
    const imageWithRemovedBackground = Buffer.of(12, 32);
    const opaqueImage = fs.readFileSync(path.join(__dirname, '../../resources/opaque-image.jpg'));
    when(removeBgGateway.removeBackground(opaqueImage)).thenResolve({
      image: imageWithRemovedBackground,
      contentType: 'image/png',
    });

    const processedImage = await imageProcessor.process(opaqueImage);

    expect(processedImage).to.deep.equal({image: imageWithRemovedBackground, contentType: 'image/png'});
  });
});
