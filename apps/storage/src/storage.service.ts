import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService) {}
  
  getHello(): string {
    const path = this.configService.get<string>("PATH_STORAGE_IMAGES");
    console.log(path);
    
    return "Hello World!";
  }
}
