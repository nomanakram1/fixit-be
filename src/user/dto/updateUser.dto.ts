import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsUUID, IsObject, IsArray } from 'class-validator';
import { AuthProvidersEnum } from "../../auth/enum/auth-providers.enum";

export class UpdateUserDto {
  @ApiProperty({
    description: 'Unique identifier of the user to be updated',
    example: 'a3c3b5f3-8e34-4a2b-9026-0c21b7b6e04a',
  })
  @IsUUID()
  id: string;

  // UsersEntity fields
  @ApiPropertyOptional({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Flag to indicate if the user’s phone number is verified',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Username of the user',
    example: 'username123',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Password of the user (will be hashed)',
    example: 'securePassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'Provider type for authentication',
    example: AuthProvidersEnum.email,
    enum: AuthProvidersEnum,
  })
  @IsOptional()
  @IsEnum(AuthProvidersEnum)
  provider?: AuthProvidersEnum;

  @ApiPropertyOptional({
    description: 'Social ID of the user for third-party authentication',
    example: '1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  socialId?: string;

  @ApiPropertyOptional({
    description: 'Type of user',
    example: 'customer',
    enum: ['customer', 'professional'],
  })
  @IsOptional()
  @IsString()
  userType?: string;

  @ApiPropertyOptional({
    description: 'Specifies if the user has admin privileges',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiPropertyOptional({
    description: 'Indicates if the user is currently active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Flag to indicate if the user’s phone number is verified',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  // UserDetailsEntity fields
  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'URL of the user’s profile picture',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Address of the user, including street, city, state, zip, and country',
    example: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'Anystate',
      zip: '12345',
      country: 'CountryName',
    },
  })
  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @ApiPropertyOptional({
    description: 'Latitude of the user’s location',
    example: 40.7128,
  })
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude of the user’s location',
    example: -74.0060,
  })
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Bio of the user',
    example: 'This is a short bio about the user.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Skills of the user as an array of strings',
    example: ['JavaScript', 'Node.js', 'NestJS'],
  })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional({
    description: 'Rating of the user',
    example: 4,
  })
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Count of reviews for the user',
    example: 10,
  })
  @IsOptional()
  reviewCount?: number;
}

export class UpdateUserPassword{
      @IsUUID()
      id: string;
      
    @ApiPropertyOptional({
        description: 'Password of the user (will be hashed)',
        example: 'securePassword123',
      })
      @IsOptional()
      @IsString()
      password?: string;

}
