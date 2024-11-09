import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDetailsService } from './userDetails.service';
import { CreateUserDetailsDto } from './dto/createUserDetials.dto';
import { UserDetailsEntity } from './entity/userDetails.entity';
import { UpdateUserDetailsDto } from './dto/UpdateUserDetials.dto';

@ApiTags('User Details')
@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user details' })
  @ApiResponse({ status: 201, description: 'User details created successfully.', type: UserDetailsEntity })
  async createUserDetails(@Body() createUserDetailsDto: CreateUserDetailsDto): Promise<UserDetailsEntity> {
    return this.userDetailsService.createUserDetails(createUserDetailsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user details' })
  @ApiResponse({ status: 200, description: 'List of user details', type: [UserDetailsEntity] })
  async getAllUserDetails(): Promise<UserDetailsEntity[]> {
    return this.userDetailsService.getAllUserDetails();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'User details found', type: UserDetailsEntity })
  @ApiResponse({ status: 404, description: 'User details not found' })
  async getUserDetailsById(@Param('id') id: string): Promise<UserDetailsEntity> {
    return this.userDetailsService.getUserDetailsById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiResponse({ status: 200, description: 'User details updated successfully', type: UserDetailsEntity })
  @ApiResponse({ status: 404, description: 'User details not found' })
  async updateUserDetails(
    @Param('id') id: string,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<UserDetailsEntity> {
    return this.userDetailsService.updateUserDetails(id, updateUserDetailsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user details by ID' })
  @ApiResponse({ status: 204, description: 'User details deleted successfully' })
  @ApiResponse({ status: 404, description: 'User details not found' })
  async deleteUserDetails(@Param('id') id: string): Promise<void> {
    return this.userDetailsService.deleteUserDetails(id);
  }
}
