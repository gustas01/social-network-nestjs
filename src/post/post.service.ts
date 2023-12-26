import { Injectable } from '@nestjs/common';
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
    const post: Post[] = await this.postRepository.find({
      relations: { author: false },
      where: { author: {id: userId} } as FindOptionsWhere<Post>,
    });
    return post;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

