import { Inject, Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import { IParsedData } from "./types";
import { DownloaderService } from "./DownloaderService";

const puppeteer = require("puppeteer");

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  private browser;

  constructor(private readonly downloader: DownloaderService) {
  }

  async createBrowser() {
    if (!this.browser)
      this.browser = await puppeteer.launch({ headless: false });
  }

  async parseOzonPage(url: string): Promise<IParsedData> {
    try {
      if (!this.browser)
        await this.createBrowser();

      const page = await this.browser.newPage();
      const devices = puppeteer.devices;
      const iPhone = devices["iPhone SE"];
      await page.emulate(iPhone);
      await page.setJavaScriptEnabled(true);
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const titleDom = await page.waitForSelector("div[data-widget=webMobProductHeading] h1");
      const priceDom = await page.waitForSelector("div[data-widget=\"webPrice\"]");
      const imgDom = await page.waitForSelector("div[data-widget=\"webMobGallery\"] img");

      const content = await page.content();
      await page.close();
      const $ = cheerio.load(content);

      const title = $("div[data-widget=webMobProductHeading] h1").text().trim();
      const price$ = $("div[data-widget=\"webPrice\"] span:first").text();
      let price = price$.replace(/\s/g, "");
      price = price && /(\d+)/.exec(price)[0];
      const img = $("div[data-widget=\"webMobGallery\"] img").attr("src");

      if (img) {
        const pathImage = await this.downloader.getByUrlImage(img).then(path => path).catch(e => "");
        return { price: price && Number(price), name: title, img: pathImage || img };
      }

      return { price: price && Number(price), name: title, img };
    } catch (e) {
      this.logger.error(e);
      this.browser?.close();
      this.browser = null;
    }
  }

  async parseWBPage(url: string): Promise<IParsedData> {
    try {
      await this.createBrowser();

      const page = await this.browser.newPage();
      const devices = puppeteer.devices;
      const iPhone = devices["iPhone SE"];
      await page.emulate(iPhone);
      await page.setJavaScriptEnabled(true);
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const titleDom = await page.waitForSelector("div.product-page__header h1");
      const priceDom = await page.waitForSelector("span.price-block__price");
      const imgDom = await page.waitForSelector(".slide__content.img-plug img");

      const content = await page.content();
      await page.close();
      const $ = cheerio.load(content);

      const title = $("div.product-page__header h1:first").text();
      const price$ = $("span.price-block__price:first");
      let price = $(price$).text().replace(/\s/g, "");
      price = price && /(\d+)/.exec(price)[0];

      const img = $(".slide__content.img-plug img:first").attr("src");

      if (img) {
        const pathImage = await this.downloader.getByUrlImage(img).then(path => path).catch(e => "");
        return { price: price && Number(price), name: title, img: pathImage || img };
      }

      return { price: price && Number(price), name: title, img };
    } catch (e) {
      this.logger.error(e);
      this.browser?.close();
      this.browser = null;
    }
  }
}
