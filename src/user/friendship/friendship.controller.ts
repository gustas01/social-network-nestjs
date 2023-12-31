import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '@nestjs/passport';
import { SendFriendRequestDto } from '../dto/send-friend-request.dto';
import { RespondFriendRequestDto } from '../dto/respond-friend-request.dto';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('friendship')
@UseGuards(AuthGuard('jwt'))
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post('sendRequest')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequest(@Body() sendFriendRequestDto: SendFriendRequestDto, @Req() req: Request) {
    const { id: userId } = req.user as User;
    return await this.friendshipService.sendFriendRequest(sendFriendRequestDto, userId);
  }
  
  @Post('respondRequest')
  @HttpCode(HttpStatus.OK)
  async respondFriendRequest(@Body() respondFriendRequestDto: RespondFriendRequestDto, @Req() req: Request) {
    const { id: userId } = req.user as User;
    return await this.friendshipService.respondFriendRequest(respondFriendRequestDto, userId);
  }
}

