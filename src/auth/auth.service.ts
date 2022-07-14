import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly prismaService: PrismaService,
              private readonly jwtService: JwtService) {
  }

  async signUpLocal(authDto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(authDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        hash,
      },
    });

    const tokens = await this.genTokens(newUser.uid, newUser.email);
    // @ts-ignore
    await this.updateRtHash({uid: newUser.uid}, tokens.refresh_token);
    return tokens;
  }

  async signInLocal(authDto: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compareSync(authDto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.genTokens(user.uid, user.email);
    // @ts-ignore
    await this.updateRtHash({uid: user.uid }, tokens.refresh_token);
    return tokens;
  }

  async logOutLocal(uid: string) {
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
  }

  async refreshToken(uid: string, rt: string) {

    const user = await this.prismaService.user.findUnique({
      where: {
        // @ts-ignore
        uid
      },
    });

    if (!user || !user.hasheRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compareSync(rt, user.hash);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.genTokens(user.uid, user.hasheRt);
    // @ts-ignore
    await this.updateRtHash({uid: user.uid}, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async genTokens(uid: string, email: string): Promise<Tokens> {
    const [at, rt] =  await Promise.all([
      this.jwtService.signAsync({
        sub: uid,
        email,
      }, { expiresIn: 60 * 15, secret: 'jwtConstants.secret.at' }),
      this.jwtService.signAsync({
        sub: uid,
        email,
      }, { expiresIn: 60 * 60 * 24 * 7, secret: 'jwtConstants.secret.rt' }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(where: Prisma.UserWhereUniqueInput, rt: string){
    const hash = await this.hashData(rt);
    await this.prismaService.user.update({
      where,
      data: {
        hasheRt: hash
      }
    });
  }

  // async updateRtHash(uid: string, rt: string) {
  //   const hash = await this.hashData(rt);
  //   await this.prismaService.user.update({
  //     where: {
  //       uid,
  //     }, data: {
  //       hasheRt: hash
  //     }
  //   });
  // }
}
