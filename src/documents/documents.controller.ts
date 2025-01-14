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

  @TsRest(c.createPost)
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp/' }))
  async createPost(
    @TsRestRequest() { body }: RequestShapes['createPost'],
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`DocumentsController - Uploading file ${file.originalname}`);
    await this.documentsService.create({
      ...body,
      file,
    });
    return { status: 201 as const, body: { body, file } as any };
  }

  @TsRest(c.getPost)
  async getPost(@TsRestRequest() { params: { id } }: RequestShapes['getPost']) {
    const post = await this.documentsService.getById(id);

    if (!post) {
      return { status: 204 as const, body: null };
    }
    return { status: 200 as const, body: post as any };
  }
}
