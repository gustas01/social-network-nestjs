import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const user: User = await this.userService.findOne(userId);

    const post: Post = this.postRepository.create(createPostDto);
    post.author = user;
    await this.postRepository.save(post);
    return post;
  }

  async findAllByUser(userId: string) {
    const posts: Post[] = await this.postRepository.find({
      relations: { author: false },
      where: { author: { id: userId } } as FindOptionsWhere<Post>,
    });
    return posts;
  }

  async findOne(id: string) {
    const post: Post = await this.postRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!post) throw new NotFoundException('Postagem apagada ou inexistente!');

    return post;
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    if (!Object.keys(updatePostDto).length)
      throw new BadRequestException('Nenhuma informação fornecida para atualização!');

    const post: Post = await this.postRepository.findOne({where: {id}, relations: {author: true}})

    if (!post) throw new NotFoundException('Postagem apagada ou inexistente!');

    if (post.author.id !== userId)
      throw new UnauthorizedException('Impossível alterar comentário de outro usuário!');

    if (!post) throw new NotFoundException('Comentário não encontrado');

    await this.postRepository.update(id, updatePostDto);
    
    return { msg: 'Post atualizado com sucesso!' };
  }

  async remove(id: string, userId: string) {
    const post: Post = await this.postRepository.findOne({where: {id}, relations: {author: true}})

    if (!post) throw new NotFoundException('Postagem apagada ou inexistente!');

    if (post.author.id !== userId)
    throw new UnauthorizedException('Impossível apagar comentário de outro usuário!');

    await this.postRepository.delete(id);

    return { msg: 'Postagem apagada com sucesso!' };
  }
}

