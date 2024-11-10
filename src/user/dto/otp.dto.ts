import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'a3c3b5f3-8e34-4a2b-9026-0c21b7b6e04a',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'OTP code sent to the user',
    example: '12345',
  })
  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 characters' })
  otp: string;
}
