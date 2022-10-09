import { IProduct } from "../types";

type ProductUpdate = Partial<IProduct>

export class UpdateProductDto implements ProductUpdate{
  uid: string
  uidWishList: string
  description?: string;
  name?: string;
  labels?: string[];
}
