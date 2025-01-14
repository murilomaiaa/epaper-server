export abstract class IUploadFile {
  abstract execute(fileName: string, filePath: string): Promise<void>;
}
