import { IProduct, MarketPlace, StatusOrder } from '../types';

export class CreateProductDto implements IProduct{
  delivery: number;
  description: string;
  img: string;
  link: string;
  marketPlace: MarketPlace;
  name: string;
  price: number;
  royalties: number;
  status: StatusOrder;
  uid: string;
  uidReceiver: string;
  uidWishList: string;
}
