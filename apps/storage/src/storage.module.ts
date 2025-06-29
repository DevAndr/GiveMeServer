import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: './apps/storage/.env',
    isGlobal: true
  }),
  MulterModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      dest: `${configService.get<string>('PATH_STORAGE_IMAGES')}/uploads`,
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    }),
  }),
],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
