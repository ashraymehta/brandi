import 'reflect-metadata';
import {S3} from 'aws-sdk';
import {expect} from 'chai';
import {ManagedUpload} from 'aws-sdk/clients/s3';
import {ConfigUtil} from '../../../utils/config.util';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {deepEqual, instance, mock, when} from 'ts-mockito';

describe(S3Gateway.name, () => {
  const s3 = mock(S3);
  const configUtil = mock(ConfigUtil);
  const s3Gateway = new S3Gateway(instance(s3), instance(configUtil));

  it('should create file on S3', async () => {
    const buffer = Buffer.of();
    const key = 'not-a-great-key';
    const bucketName = 'bucket-name';
    const uploadLocation = 'https://s3.amazonaws.com/something/something/';
    const managedUpload = mock(ManagedUpload);
    when(configUtil.getS3BucketName()).thenResolve(bucketName);
    when(
      s3.upload(deepEqual({Body: buffer, Bucket: bucketName, Key: key})),
    ).thenReturn(instance(managedUpload));
    when(managedUpload.promise()).thenResolve({
      Bucket: bucketName,
      Key: key,
      ETag: '',
      Location: uploadLocation,
    });

    const location = await s3Gateway.upload(buffer, key);

    expect(location).to.equal(uploadLocation);
  });
});
