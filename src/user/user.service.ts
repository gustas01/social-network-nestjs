import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    newUser.password = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt(10));
    return await this.usersRepository.save(newUser);
  }

  async findOne(id: string, userId?: string) {
    let user: User = null;
    if (id === userId) {
      user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          posts: true,
          comments: true,
          addressedFriendRequests: true,
          receivedFriendRequests: true,
          friends: true,
        },
      });
    }
    else {
      user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          posts: true,
          comments: true,
          friends: true,
        },
      });
      delete user.email
    }
    
    delete user.password

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    return user;
  }

  async findOneByEmail(email: string) {
    const user: User = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // if (updateUserDto.password)
    //   updateUserDto.password = await bcrypt.hash(updateUserDto.password, await bcrypt.genSalt(10));

    // await this.usersRepository.update(id, updateUserDto);
    // return this.usersRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}

