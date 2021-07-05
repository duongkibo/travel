import AWS, { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { PassThrough } from 'stream';
// import { v2 } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { MulterFile } from 'src/modules/media/media.interface';
import fs from 'fs';


    v2.config({
      cloud_name: 'chn2017',
      api_key: '565595437525295',
      api_secret: '1Cgr4CMPnfuu_BAp2Aus7yZhnXQ',
    });
 

/**
 * S3 instance
 */
export const s3 = new AWS.S3({
  /**
   *
   */
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  /**
   *
   */
  secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  /**
   * Timeout 1 minute
   */
  httpOptions: { timeout: 60 * 60 * 1000 },
});

export const createUploadStream = (
  data: Omit<S3.Types.PutObjectRequest, 'Bucket' | 'Body'>,
  options?: ManagedUpload.ManagedUploadOptions,
) => {
  const pass = new PassThrough();
  return {
    writeStream: pass,
    promise: s3
      .upload(
        {
          Bucket: process.env.S3_AWS_BUCKET_NAME ?? '',
          ACL: 'public-read',
          CacheControl: 'max-age=31536000', // 365 days
          ...data,
          Body: pass,
        },
        options,
      )
      .promise(),
  };
};


  export const uploadImage = (
    file: MulterFile,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    console.log(file.path)
    const readStream = fs.createReadStream(file.path);
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload(file.path, {
      }).then(result => {
        console.log('dada', result)
        resolve(result)
      }).catch(err => {
        console.log(err);
      });
    // console.log(readStream)
    //   toStream(readStream).pipe(upload);
    });
  }
