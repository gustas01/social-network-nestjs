import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendFriendRequestDto } from '../dto/send-friend-request.dto';
import { UserService } from '../user.service';

@Injectable()
export class FriendshipService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async sendFriendRequest(sendFriendRequestDto: SendFriendRequestDto, userId: string) {
    const addressedUser: User = await this.usersRepository.findOne({
      where: { id: sendFriendRequestDto.addressedUserId },
      relations: { receivedFriendRequests: true, addressedFriendRequests: true }, select: { email: true, id: true }
    });

    if (!addressedUser) throw new NotFoundException('Usuário não encontrado!');

    const requesterUser: User = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { addressedFriendRequests: true }, select: { email: true, id: true }
    });

    addressedUser.receivedFriendRequests.unshift(requesterUser);
    requesterUser.addressedFriendRequests.unshift(addressedUser);

    await this.usersRepository.save(addressedUser);
    await this.usersRepository.save(requesterUser);

    return { msg: "Solicitação de amizade enviada" }
  }

  async respondFriendRequest() {}
}

