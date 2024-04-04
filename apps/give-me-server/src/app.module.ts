import {Module} from "@nestjs/common";
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {WishListModule} from "./wish-list/wish-list.module";
import {HistoryModule} from "./history/history.module";
import {NotificationModule} from "./notification/notification.module";
import {BannersModule} from "./banners/banners.module";
import {PrismaModule} from "./prisma/prisma.module";
import {APP_GUARD} from "@nestjs/core";
import {ProductModule} from "./product/product.module";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {GqlAuthGuard} from "./common/decorators/guards";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PubSub} from "graphql-subscriptions";
import {
    ApolloServerPluginLandingPageLocalDefault,
} from "@apollo/server/plugin/landingPage/default";
import {Role} from "@prisma/client";
import {
    GraphQLDateTime
} from 'graphql-iso-date';

export interface GqlContext {
    req: Request;
    res: Response;
    headers: Headers;
    extra: any;
}

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            imports: [ConfigModule],
            inject: [ConfigService],
            driver: ApolloDriver,
            useFactory: async (configService: ConfigService) => ({
                playground: false,
                debug: false,
                path: '/graphql',
                cors: {
                    origin: true,
                    // origin: 'http://localhost:3000',
                    credentials: true
                },
                plugins: [ApolloServerPluginLandingPageLocalDefault()],
                typePaths: ["./**/*.graphql"],
                resolvers: {DateTime: GraphQLDateTime, Role: Role},
                // context: ({req}) => ({headers: req.headers}),
                context: (ctx: GqlContext) => ({...ctx}),
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
        NotificationModule, BannersModule, PrismaModule, ProductModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: GqlAuthGuard
        },
        {
            provide: "PUB_SUB",
            useValue: new PubSub()
        }
    ]
})

export class AppModule {
}
