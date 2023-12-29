import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendFriendRequestDto } from '../dto/send-friend-request.dto';
import { RespondFriendRequestDto } from '../dto/respond-friend-request.dto';

@Injectable()
export class FriendshipService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async sendFriendRequest(sendFriendRequestDto: SendFriendRequestDto, userId: string) {
    const addressedUser: User = await this.usersRepository.findOne({
      where: { id: sendFriendRequestDto.addressedUserId },
      relations: { receivedFriendRequests: true, friends: true },
      select: { email: true, id: true },
    });

    if (!addressedUser) throw new NotFoundException('Usuário não encontrado!');

    if (addressedUser.friends.some((el) => el.id === userId))
      throw new ConflictException('Vocês já são amigos!');

    if (sendFriendRequestDto.addressedUserId === userId)
    throw new BadRequestException('Impossível mandar solicitação para si mesmo!');

    if (addressedUser.receivedFriendRequests.some((el) => el.id === userId))
      throw new ConflictException('Solicitação de amizade já enviada');

    const requesterUser: User = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { addressedFriendRequests: true },
      select: { email: true, id: true },
    });

    addressedUser.receivedFriendRequests.unshift(requesterUser);
    requesterUser.addressedFriendRequests.unshift(addressedUser);

    await this.usersRepository.save(addressedUser);
    await this.usersRepository.save(requesterUser);

    return { msg: "Solicitação de amizade enviada com sucesso!'" };
  }

  async respondFriendRequest(respondFriendRequestDto: RespondFriendRequestDto, userId: string) {
    const requesterUser: User = await this.usersRepository.findOne({
      where: { id: respondFriendRequestDto.requesterUserId },
      relations: { addressedFriendRequests: true, friends: true },
      select: { email: true, id: true },
    });

    if (!requesterUser) throw new NotFoundException('Usuário não encontrado!');

    if (respondFriendRequestDto.requesterUserId === userId)
      throw new BadRequestException('Impossível responder solicitação de si mesmo!');

    if (!requesterUser.addressedFriendRequests.some((el) => el.id === userId)) {
      throw new NotFoundException('Solicitação de amizade inexistente!');
    }

    const addressedUser: User = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { receivedFriendRequests: true, friends: true },
      select: { email: true, id: true },
    });

    const indexAddresser = requesterUser.addressedFriendRequests.findIndex(
      (el) => el.id === addressedUser.id,
    );
    requesterUser.addressedFriendRequests.splice(indexAddresser, 1);

    const indexRequester = addressedUser.receivedFriendRequests.findIndex(
      (el) => el.id === requesterUser.id,
    );
    addressedUser.receivedFriendRequests.splice(indexRequester, 1);

    if (respondFriendRequestDto.response) {
      requesterUser.friends.unshift(addressedUser);
      addressedUser.friends.unshift(requesterUser);
    }

    await this.usersRepository.save(requesterUser);
    await this.usersRepository.save(addressedUser);


    return respondFriendRequestDto.response
      ? { msg: 'Solicitação aceita com sucesso!' }
      : { msg: 'Solicitação recusada!' };
  }
}

