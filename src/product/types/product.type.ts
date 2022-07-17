import { MarketPlace, StatusOrder } from './index';

export interface IProduct {
  name: string
  description: string
  marketPlace: MarketPlace
  link: string
  img: string
  status: StatusOrder
  uidWishList: string
  uid: string
  uidReceiver: string;
  price: number;
  royalties: number;
  delivery: number;
}
