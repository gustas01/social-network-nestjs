import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({session: false}),
    UserModule
  ],
  providers: [AuthService, JwtStrategyService],
  controllers: [AuthController]
})
export class AuthModule {}
