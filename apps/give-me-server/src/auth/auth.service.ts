import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import * as argon from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/Jwt-payload.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly config: ConfigService,
              private readonly prismaService: PrismaService,
              private readonly jwtService: JwtService) {
  }

  async signUpLocal(authDto: SignUpDto): Promise<Tokens> {
    const hash = await argon.hash(authDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        name: authDto.name,
        hash,
      },
    }).catch((e) => {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(`пользователь с email: ${authDto.email} уже существует`);
        }
      }
      throw e;
    });

    const tokens = await this.genTokens(newUser.uid, newUser.email);
    await this.updateRtHash(newUser.uid, tokens.refresh_token);
    return tokens;
  }

  async signInLocal(authDto: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.hash, authDto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.genTokens(user.uid, user.email);
    await this.updateRtHash(user.uid, tokens.refresh_token);
    return tokens;
  }

  async logOutLocal(uid: string): Promise<boolean> {
    await this.prismaService.user.updateMany({
      where: {
        uid,
        hasheRt: {
          not: null,
        },
      }, data: {
        hasheRt: null,
      },
    });

    return true;
  }

  async refreshToken(uid: string, rt: string): Promise<Tokens> {

    const user = await this.prismaService.user.findUnique({
      where: {
        uid,
      },
    });

    if (!user || !user.hasheRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hasheRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.genTokens(user.uid, user.email);
    await this.updateRtHash(user.uid, tokens.refresh_token);
    return tokens;
  }

  async genTokens(uid: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: uid,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, { expiresIn: '7d', secret: this.config.get<string>('AT_SECRET') }),
      this.jwtService.signAsync(jwtPayload, { expiresIn: '30d', secret: this.config.get<string>('RT_SECRET') }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(uid: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prismaService.user.update({
      where: {
        uid,
      },
      data: {
        hasheRt: hash,
      },
    });
  }
}