import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseFilters } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserQueryFailedFilter } from 'src/filters/user-query-failed/user-query-failed.filter';

@Controller('comment')
@UseFilters(UserQueryFailedFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  @UseGuards(AuthGuard('jwt'))
  create(@Param('postId') postId: string, @Req() req: Request, @Body() createCommentDto: CreateCommentDto) {
    const { id: userId } = req.user as User
    return this.commentService.create(userId, postId, createCommentDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request, ) {
    const { id: userId } = req.user as User
    return this.commentService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: Request, @Body() updateCommentDto: UpdateCommentDto) {
    const { id: userId } = req.user as User
    return this.commentService.update(id, userId, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = req.user as User
    return this.commentService.remove(id, userId,);
  }
}
