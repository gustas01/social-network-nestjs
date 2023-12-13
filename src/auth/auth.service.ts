import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private config: ConfigService) { }

  async register() { }

  async login() {
    return this.jwtService.sign({ id: 1 }, {
      secret: this.config.get("TOKEN_SECRET"), 
      issuer: this.config.get("TOKEN_ISSUER"),
      audience: this.config.get("TOKEN_AUDIENCE"),
      expiresIn: '1h',
      algorithm: "HS384"
    })
  }
}
