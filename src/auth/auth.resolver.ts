import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphqlAccess, Public, ResGql } from '../common/decorators';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { GqlAuthGuard } from '../common/decorators/guards';
import { UseGuards } from '@nestjs/common';

@Resolver("auth")
export class AuthResolver {
  constructor(private readonly jwt: JwtService,  private readonly authService: AuthService) {}

  // @UseGuards(GqlAuthGuard)
  @Public()
  // @GraphqlAccess()
  // @GqlAuthGuard()
  @Mutation('logIn')
  async login(@Args('data') authDto: AuthDto): Promise<Tokens> {
    console.log('login', authDto);
    return this.authService.signInLocal(authDto);
  }

  @Public()
  // @GraphqlAccess()
  @Mutation('test')
  async test(@Args('email') email: String, @ResGql() res: Response){
    console.log(res, email);
    return email;
  }
}
