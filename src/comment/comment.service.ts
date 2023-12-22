import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private userService: UserService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const comment: Comment = this.commentRepository.create(createCommentDto);
    const user: User = await this.userService.findOne(userId);
    comment.author = user;
    return await this.commentRepository.save(comment);
  }

  async findAllByUser(userId: string) {
    const comment: Comment[] = await this.commentRepository.find({
      relations: { author: false },
      where: { author: { id: userId } } as FindOptionsWhere<Comment>,
    });
    return comment;
  }

  async findOne(commentId: string) {
    const comment: Comment = await this.commentRepository.findOne({
      relations: { author: false },
      where: { id: commentId },
    });
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

