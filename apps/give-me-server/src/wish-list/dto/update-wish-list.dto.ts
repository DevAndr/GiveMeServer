import { IWishListBase } from "../types";

export class UpdateWishListDto implements IWishListBase {
  id: string;
  idUser: string;
}
