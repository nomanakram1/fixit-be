import { PartialType } from '@nestjs/swagger';
import { CreateUserDetailsDto } from './createUserDetials.dto';

export class UpdateUserDetailsDto extends PartialType(CreateUserDetailsDto) {}
