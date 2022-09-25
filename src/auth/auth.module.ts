import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule, PrismaModule, JwtModule.register({

  })],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, ConfigService, AuthResolver],
})

export class AuthModule {}
