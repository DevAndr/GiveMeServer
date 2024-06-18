import { Concrete } from "../../common/types";

export type UpdatedDataUser = {
  id?: string;
  name?: string;
  email?: string;
  createAt?: string | Date;
  updateAt?: string | Date;
};

export type PublicDataUser = Concrete<UpdatedDataUser>;
