import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import axios from "axios";

@Injectable()
export class DownloaderService {
  constructor(private readonly config: ConfigService) {
  }

  checkBasePath() {
    const pathStorage = `${this.config.get("PATH_STORAGE_IMAGES")}/uploads` ||  "H:\\NodeJsApps\\GiveMe\\give-me\\public\\uploads\\images";

    if (!fs.existsSync(pathStorage)) {
      // Если путь не существует, создаем его
      fs.mkdirSync(pathStorage, { recursive: true });
      console.log("Путь создан:", pathStorage);
    } else {
      console.log("Путь уже существует:", pathStorage);
    }

    return pathStorage;
  };

  async getByUrlImage(url: string): Promise<string> {
    try {
      const pathStorage = this.checkBasePath();
      const file = url.split("/").pop();
      const ext = file.split(".").pop();
      const filename =   Date.now() + "." + ext;
      const filepath = pathStorage + "\\" + filename;
      const writer = fs.createWriteStream(filepath);
      const response = await axios.get(url, { responseType: "stream" });
      response.data.pipe(writer);
      
      const urlFile = this.config.get("HOST_URL_STORAGE_SERVICE") + "/storage/images/" + filename;

      return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(urlFile));
        writer.on("error", reject);
      });
    } catch (e) {
      throw new Error(`Failed to download image: ${e.message}`);
    }
  }
}