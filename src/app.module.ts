import { Module } from '@nestjs/common';
import { DocumentsController } from './documents/documents.controller';
import { DocumentsService } from './documents/documents.service';

@Module({
  imports: [],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class AppModule {}
