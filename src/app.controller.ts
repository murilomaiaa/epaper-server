import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';
import { contract } from './contract';

const c = nestControllerContract(contract);
type RequestShapes = NestRequestShapes<typeof c>;

@Controller()
export class PostController implements NestControllerInterface<typeof c> {
  constructor(private readonly postService: AppService) {}

  @TsRest(c.getPost)
  async getPost(@TsRestRequest() { params: { id } }: RequestShapes['getPost']) {
    const post = await this.postService.getById(id);

    if (!post) {
      return { status: 204 as const, body: null };
    }
    return { status: 200 as const, body: post };
  }

  @TsRest(c.createPost)
  async createPost(@TsRestRequest() { body }: RequestShapes['createPost']) {
    const post = await this.postService.createPost({
      title: body.title,
      body: body.body,
    });

    return { status: 201 as const, body: post };
  }
}
