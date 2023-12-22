import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from 'src/user/user.module';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}