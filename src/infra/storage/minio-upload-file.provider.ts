import * as Minio from 'minio';
import { IUploadFile } from './upload-file.interface';

export class MinioUploadFile implements IUploadFile {
  private readonly client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT as string,
      port: Number(process.env.MINIO_PORT),
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async execute(fileName: string, filePath: string) {
    console.log('MinioUploadFile - Create', fileName, filePath);
    const bucket = 'rlv-m';
    return bucket;
    // const exists = await this.client.bucketExists(bucket);
    // if (exists) {
    //   console.log('Bucket ' + bucket + ' exists.');
    // } else {
    //   await this.client.makeBucket(bucket, 'us-east-1');
    //   console.log('Bucket ' + bucket + ' created in "us-east-1".');
    // }
    // console.log(
    //   `MinioUploadFile - Uploading ${filePath} - ${fileName} to ${bucket}`,
    // );

    // const response = await this.client.fPutObject(bucket, fileName, filePath);
    // console.log(`MinioUploadFile - File uploaded`);
    // return response.etag;
  }
}
