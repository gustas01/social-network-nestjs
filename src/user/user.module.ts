import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, FriendshipController],
  providers: [UserService, FriendshipService],
  exports: [UserService]
})
export class UserModule { }
