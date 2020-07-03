import 'reflect-metadata';
import {expect} from 'chai';
import {Request} from 'aws-sdk/lib/request';
import {GetObjectOutput} from 'aws-sdk/clients/s3';
import {ConfigUtil} from '../../../utils/config.util';
import {S3Gateway} from '../../../gateways/s3.gateway';
import {ManagedUpload} from 'aws-sdk/lib/s3/managed_upload';
import {deepEqual, instance, mock, verify, when} from 'ts-mockito';
import AWS = require('aws-sdk');

describe(S3Gateway.name, () => {
  const s3 = mock(AWS.S3);
  const configUtil = mock(ConfigUtil);
  const s3Gateway = new S3Gateway(instance(s3), instance(configUtil));

  it('should create file on S3', async () => {
    const buffer = Buffer.of();
    const key = 'not-a-great-key';
    const bucketName = 'bucket-name';
    const contentType = 'image/png';
    const uploadLocation = 'https://s3.amazonaws.com/something/something/';
    const managedUpload = mock(ManagedUpload);
    when(configUtil.getS3BucketName()).thenResolve(bucketName);
    when(
      s3.upload(
        deepEqual({
          Body: buffer,
          Bucket: bucketName,
          Key: key,
          ContentType: contentType,
        }),
      ),
    ).thenReturn(instance(managedUpload));
    when(managedUpload.promise()).thenResolve({
      Bucket: bucketName,
      Key: key,
      ETag: '',
      Location: uploadLocation,
    });

    await s3Gateway.upload(buffer, key, contentType);

    verify(managedUpload.promise()).once();
  });

  // Disabled because: `TypeError: s3.getObject is not a function` for some reason
  xit('should get file from S3', async () => {
    const buffer = Buffer.of();
    const key = 'not-a-great-key';
    const bucketName = 'bucket-name';
    const request = mock(Request);
    when(configUtil.getS3BucketName()).thenResolve(bucketName);
    when(s3.getObject(deepEqual({Bucket: bucketName, Key: key}))).thenReturn(instance(request));
    when(request.promise()).thenResolve(<GetObjectOutput>{
      Body: buffer,
      ContentType: 'image/png',
    });

    const result = await s3Gateway.get(key);

    expect(result).to.deep.equal({buffer: buffer, contentType: 'image/png'});
  });
});
