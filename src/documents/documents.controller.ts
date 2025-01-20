import { Controller, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';
import { FileInterceptor } from '@nestjs/platform-express';
import { documentContract } from './documents.contract';

const c = nestControllerContract(documentContract);
type RequestShapes = NestRequestShapes<typeof c>;

@Controller()
export class DocumentsController implements NestControllerInterface<typeof c> {
  constructor(private readonly documentsService: DocumentsService) {}

  @TsRest(c.createUpdate)
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp/' }))
  async createUpdate(
    @TsRestRequest() { body }: RequestShapes['createUpdate'],
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`DocumentsController - Uploading file ${file.originalname}`);
    const response = await this.documentsService.create({
      ...body,
      file,
    });
    return { status: 201 as const, body: response };
  }

  @TsRest(c.updateDocument)
  async updateDocument(
    @TsRestRequest() { params: { id } }: RequestShapes['updateDocument'],
  ) {
    console.log(`DocumentsController - Updating file data for file ${id}`);
    // const response = await this.documentsService.update(id, body);
    // return { status: 201 as const, body: response };
    return { status: 200 as const, body: null as any };
  }

  @TsRest(c.getDocument)
  async getDocument(
    @TsRestRequest() { params: { id } }: RequestShapes['getDocument'],
  ) {
    const document = await this.documentsService.getById(id);

    if (!document) {
      return { status: 204 as const, body: null };
    }
    return { status: 200 as const, body: document };
  }

  @TsRest(c.getDocuments)
  async getDocuments(
    @TsRestRequest() { query }: RequestShapes['getDocuments'],
  ) {
    const result = await this.documentsService.findMany(query);

    return { status: 200 as const, body: result };
  }
}
