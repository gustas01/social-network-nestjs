import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategyService.extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get("TOKEN_SECRET"),
      issuer: config.get("TOKEN_ISSUER"),
      audience: config.get("TOKEN_AUDIENCE"),
    });
  }

  //esse método é tipo um middleware para verificar se o usuário existe.
  //Aqui, pegar o ID do user que vem no token (no payload) e verificar se o usuário existe,
  //se existir, retorna o usuário, para ser adicionado no req.user do express no caso; caso não
  //exista, retorne null
  async validate(payload: any) { 
    return payload;
  }


  private static extractJWTFromCookies(req: Request) {
    if(req.cookies && 'token' in req.cookies && req.cookies.token.length > 0)
      return req.cookies.token
    return null
  }

}
