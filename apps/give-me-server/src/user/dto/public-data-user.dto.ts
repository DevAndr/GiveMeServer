import { PublicDataUser } from '../types';

export class PublicDataUserDto implements PublicDataUser{
  createAt: string | Date;
  email: string;
  name: string;
  id: string;
  updateAt: string | Date;
}
