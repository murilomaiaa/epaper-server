import { Module } from '@nestjs/common';
import { PostController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [AppService],
})
export class AppModule {}
