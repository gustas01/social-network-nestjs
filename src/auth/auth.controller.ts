import { Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Res({passthrough: true}) response: Response){
    response.cookie('token', await this.authService.login(), {
      httpOnly: true,
      secure: true,
      path: '/',
    });
  }
}
