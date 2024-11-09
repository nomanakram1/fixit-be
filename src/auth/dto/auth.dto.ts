import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@gmail.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  password: string;


}

export enum UserTypeEnum {
  CUSTOMER = 'customer',
  PROFESSIONAL = 'professional',
}

export class SignupDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  password: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  email: string;

  // @ApiProperty({
  //   example: 'customer',
  //   description: 'The type of user, either "customer" or "professional"',
  //   enum: UserTypeEnum,
  // })
  // @IsEnum(UserTypeEnum, { message: 'userType must be either customer or professional' })
  // userType: UserTypeEnum;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email address of the user' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset_token', description: 'The reset token sent to the user email' })
  token: string;

  @ApiProperty({ example: 'newStrongPassword123', description: 'The new password for the user' })
  newPassword: string;
}

function IsEnum(UserTypeEnum: any, arg1: { message: string; }): (target: SignupDto, propertyKey: "userType") => void {
  throw new Error('Function not implemented.');
}
