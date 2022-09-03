import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WishListModule } from './wish-list/wish-list.module';
import { HistoryModule } from './history/history.module';
import { NotificationModule } from './notification/notification.module';
import { BannersModule } from './banners/banners.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/decorators/guards';
import { ProductModule } from './product/product.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLDateTime } from 'graphql-iso-date';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Role } from './user/entities/user.entity';
import { GqlAuthGuard } from './common/decorators/guards/gql-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

export interface GqlContext {
  req: Request;
  res: Response;
  headers: Headers;
}

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        playground: false,
        debug: false,
        cors: {
          origin: true,
          // origin: 'http://localhost:3000',
          // origin: 'https://studio.apollographql.com',
          credentials: true
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        typePaths: ['./src/**/*.graphql'],
        resolvers: { DateTime: GraphQLDateTime, Role: Role },
        // context: ({req}) => ({headers: req.headers}),
        context: ({req, res}: GqlContext) => ({req, res, headers: req.headers}),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
      })
    }),
    UserModule, AuthModule, WishListModule, HistoryModule,
    NotificationModule, BannersModule, PrismaModule, ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD, useClass: GqlAuthGuard,
    }
  ],
})

export class AppModule {
}
