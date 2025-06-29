import { IProduct } from "../types";

type ProductUpdate = Partial<IProduct>

export class UpdateProductDto implements ProductUpdate{
  id: string
  idWishList: string
  description?: string;
  name?: string;
  labels?: string[];
}
