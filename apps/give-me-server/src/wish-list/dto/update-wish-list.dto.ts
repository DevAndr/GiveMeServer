import { IWishListBase } from "../types";

export class UpdateWishListDto implements IWishListBase {
  uid: string;
  uidUser: string;
}
