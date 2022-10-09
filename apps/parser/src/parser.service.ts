import { Inject, Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import { PARSER_SERVICE } from "./constants";
import { ClientProxy } from "@nestjs/microservices";
import { IParsedData } from "./types";
const puppeteer = require("puppeteer");

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  private browser;

  constructor() {}

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

      const titleDom = await page.waitForSelector("div[data-widget=webProductHeading]");
      // let title = await page.$eval('div[data-widget=webProductHeading]', div => div.textContent)

      const priceDom = await page.waitForSelector("div[data-widget=\"webPrice\"]");

      const imgDom = await page.waitForSelector("div[data-widget=\"webGallery\"] img");
      // let img = await page.$eval('div[data-widget="webGallery"] img', img => img.src)

      const content = await page.content();
      await page.close()
      const $ = cheerio.load(content);

      const title = $("div[data-widget=webProductHeading]:first").text();
      const price$ = $("div[data-widget=\"webPrice\"] span")["1"];
      let price = $(price$).text().replace(/\s/g, "");
      price = price && /(\d+)/.exec(price)[0];
      const img = $("div[data-widget=\"webGallery\"] img").attr("src");

      return { price: price && Number(price), name: title, img: img }
    } catch (e) {
      this.logger.error(e)
      this.browser?.close();
      this.browser = null;
    }
  }

  async parseWBPage(url: string) {
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
      const imgDom = await page.waitForSelector("div.product-page__slider img");

      const content = await page.content();
      await page.close()
      const $ = cheerio.load(content);

      const title = $("div.product-page__header h1:first").text();
      const price$ = $("span.price-block__price:first");
      let price = $(price$).text().replace(/\s/g, "");
      price = price && /(\d+)/.exec(price)[0];

      const img = "https:" + $("div.product-page__slider img:first").attr("src");

      return { price: price && Number(price), name: title, img: img }
    } catch (e) {
      this.logger.error(e)
      this.browser?.close();
      this.browser = null;
    }
  }
}
