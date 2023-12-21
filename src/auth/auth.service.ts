import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login-dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user: User = await this.userService.findOneByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user?.password)))
      throw new NotFoundException('Usuário ou senha inválidos!');

    return this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get('TOKEN_SECRET'),
        issuer: this.config.get('TOKEN_ISSUER'),
        audience: this.config.get('TOKEN_AUDIENCE'),
        expiresIn: String(this.config.get('TOKEN_EXPIRES_IN_HOURS')) + 'h',
        algorithm: 'HS384',
      },
    );
  }

  async register(createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return user;
  }
}

