import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async create(userId: string, postId: string, createCommentDto: CreateCommentDto) {
    const comment: Comment = this.commentRepository.create(createCommentDto);
    const user: User = await this.userService.findOne(userId);
    comment.author = user;
    comment.post = await this.postService.findOne(postId);
    return await this.commentRepository.save(comment);
  }

  async findAllByUser(userId: string) {
    const comment: Comment[] = await this.commentRepository.find({
      relations: { author: false, post: true },
      where: { author: { id: Equal(userId) } } as FindOptionsWhere<Comment>,
    });
    return comment;
  }

  async findOne(commentId: string) {
    const comment: Comment = await this.commentRepository.findOne({
      relations: { author: false, post: true },
      where: { id: Equal(commentId) },
    });

    if (!comment) throw new NotFoundException('Comentário apagado ou inexistente!');
    
    return comment;
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    if (!Object.keys(updateCommentDto).length)
      throw new BadRequestException('Nenhuma informação fornecida para atualização!');

    const comment = await this.commentRepository.findOne({where: { id }, relations: {author: true} });

    if (comment.author.id !== userId)
      throw new UnauthorizedException('Impossível alterar comentário de outro usuário!');

    if (!comment) throw new NotFoundException('Comentário não encontrado');

    await this.commentRepository.update(id, updateCommentDto);

    return { msg: 'Comentário atualizado com sucesso!' };
  }

  async remove(id: string, userId: string,) {
    const comment = await this.commentRepository.findOne({where: { id }, relations: {author: true} });

    if (comment.author.id !== userId)
    throw new UnauthorizedException('Impossível apagar comentário de outro usuário!');

    if (!comment) throw new NotFoundException('Comentário não encontrado');

    await this.commentRepository.delete(id);

    return { msg: 'Comentário apagado com sucesso!' };
  }
}

