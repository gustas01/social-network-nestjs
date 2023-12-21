import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dtos/login-dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserQueryFailedFilter } from 'src/filters/user-query-failed/user-query-failed.filter';

@Controller('auth')
@UseFilters(UserQueryFailedFilter)
export class AuthController {

  constructor(private authService: AuthService, private config: ConfigService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginDto, @Res({passthrough: true}) res: Response){
    res.cookie('token', await this.authService.login(login), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * Number(this.config.get('TOKEN_EXPIRES_IN_HOURS')),
      secure: true,
      path: '/',
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto){
    return this.authService.register(createUserDto);
  }
}
