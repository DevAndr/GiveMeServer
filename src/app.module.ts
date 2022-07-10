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

@Module({
  imports: [UserModule, AuthModule, WishListModule, HistoryModule, NotificationModule, BannersModule, PrismaModule],
  providers: [
    {
      provide: APP_GUARD, useClass: AtGuard
    }
  ]
})

export class AppModule {}
