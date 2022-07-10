import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})

export class AuthModule {
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZGlkaUBqay5jb20iLCJpYXQiOjE2NTc0NTQyOTksImV4cCI6MTY1NzQ1NTE5OX0.C45NmFW_ija-XTkFzxs-A30ynqjzNv7Niw8cOdjHZOs
