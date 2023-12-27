import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendshipService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>,) {}

  async sendFriendRequest() {}

  async respondFriendRequest() {}
}
