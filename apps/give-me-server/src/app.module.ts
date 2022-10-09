import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { WishListModule } from "./wish-list/wish-list.module";
import { HistoryModule } from "./history/history.module";
import { NotificationModule } from "./notification/notification.module";
import { BannersModule } from "./banners/banners.module";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { ProductModule } from "./product/product.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { GraphQLDateTime } from "graphql-iso-date";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Role } from "./user/entities/user.entity";
import { GqlAuthGuard } from "./common/decorators/guards";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PubSub } from "graphql-subscriptions";
import { RmqtModule } from "@app/common";
import { PARSER_SERVICE } from "../../parser/src/constants";
import { Transport } from "@nestjs/microservices";

export interface GqlContext {
  req: Request;
  res: Response;
  headers: Headers;
  extra: any;
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
          credentials: true
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        typePaths: ["./**/*.graphql"],
        resolvers: { DateTime: GraphQLDateTime, Role: Role },
        // context: ({req}) => ({headers: req.headers}),
        context: ({ req, res, extra }: GqlContext) => ({ req, res }),
        // context: ({ connection }) => {
        //   console.log("connection", connection);
        // },
        subscriptions: {
          "graphql-ws": true,
          //   {
          //   onConnect: (context) => {
          //     const { connectionParams, extra } = context;
          //     // extra.user =
          //     context['extra'] = 1
          //     const authorization = connectionParams?.Authorization as string;
          //     if (!authorization?.startsWith('Bearer ')) {
          //       extra['user'] = { user: {} };
          //     }
          //     // console.log("connection", extra);
          //   },
          // },
          // "subscriptions-transport-ws": true
        }
      })
    }),
    UserModule, AuthModule, WishListModule, HistoryModule,
    // RmqtModule.register({name: PARSER_SERVICE}),
    NotificationModule, BannersModule, PrismaModule, ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD, useClass: GqlAuthGuard
    },
    {
      provide: "PUB_SUB",
      useValue: new PubSub()
    }
  ]
})

export class AppModule {
}
