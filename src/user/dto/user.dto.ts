import { AuthProvidersEnum } from "src/auth/enum/auth-providers.enum";

// dto/create-user.dto.ts
export class CreateUserDto {
  username: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  provider?: AuthProvidersEnum;
  providerId?: string;
}

// dto/update-user.dto.ts
export class UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}
