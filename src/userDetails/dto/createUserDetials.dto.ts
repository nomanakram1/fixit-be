import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDetailsDto {
  @ApiProperty({ description: 'First name of the user', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'URL of the profile picture', required: false })
  profilePictureUrl?: string;

  @ApiProperty({
    description: 'Address object containing street, city, state, zip, and country',
    required: false,
    example: {
      street: '123 Main St',
      city: 'Sample City',
      state: 'Sample State',
      zip: '12345',
      country: 'Sample Country',
    },
  })
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @ApiProperty({ description: 'Latitude coordinate for location', required: false })
  latitude?: number;

  @ApiProperty({ description: 'Longitude coordinate for location', required: false })
  longitude?: number;

  @ApiProperty({ description: 'Bio of the user', required: false })
  bio?: string;

  @ApiProperty({ description: 'Skills of the user', required: false, type: [String] })
  skills?: string[];
}
