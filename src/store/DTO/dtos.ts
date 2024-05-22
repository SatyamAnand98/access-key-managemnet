import { ERole } from '../enums/role.enum';

export class User {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
  accessLevel: string;
}
