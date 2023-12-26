import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const { id: userId } = req.user as User;
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAllByUser(@Req() req: Request) {
    const { id: userId } = req.user as User;
    return this.postService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    const { id: userId } = req.user as User;
    return this.postService.update(id, userId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = req.user as User;
    return this.postService.remove(id, userId);
  }
}

