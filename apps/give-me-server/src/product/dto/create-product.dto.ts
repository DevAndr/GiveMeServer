import { TypeMarketPlace } from '@prisma/client';
import { IProduct, MarketPlace, StatusOrder } from '../types';

export class CreateProductDto implements IProduct{
  idWishList: string
  description: string;
  marketPlace: TypeMarketPlace;
  link: string;
  name: string;
  labels: string[];
}
