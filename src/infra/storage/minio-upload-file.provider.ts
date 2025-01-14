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
    const bucket = 'rlv-m';
    console.log(`MinioUploadFile - Uploading ${fileName} to ${bucket}`);
    const response = await this.client.fPutObject(bucket, fileName, filePath);
    console.log(response);
    console.log(`MinioUploadFile - File uploaded`);
  }
}
