import { IProduct, MarketPlace, StatusOrder } from '../types';

export class CreateProductDto implements IProduct{
  description: string;
  link: string;
  name: string;
  labels: string[];
}
