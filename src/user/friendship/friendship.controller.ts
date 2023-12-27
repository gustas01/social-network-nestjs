import { Controller, UseGuards } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('friendship')
@UseGuards(AuthGuard('jwt'))
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  async sendFriendRequest() {}

  async respondFriendRequest() {}
}

