import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      url: String(process.env.BD_CONNECTION_URL),
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
