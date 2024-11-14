import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UsersEntity } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto, UpdateUserPassword } from './dto/updateUser.dto';
import { VerifyOtpDto } from './dto/otp.dto';

@ApiTags('users') // Tag for grouping in Swagger UI
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  findAll(): Promise<UsersEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string): Promise<UsersEntity> {
    return this.userService.findUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  create(
    @Body() user: UsersEntity,
  ): Promise<{ user: Partial<UsersEntity>; jwt: string }> {
    return this.userService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('updateUser')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async updateUserPassword(
    //Id should be from token
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UsersEntity> {
    const userId = req.user.userId;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('updatePassword')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  async update(
    @Request() req, // Get JWT payload
    @Body() updateUserPassword: UpdateUserPassword,
  ): Promise<UsersEntity> {
    updateUserPassword.id = req.user.userId;
    return this.userService.updateUserPassword(updateUserPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async verifyOtp(
    @Request() req, // Get JWT payload
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    const userId = req.user.userId; // Get user ID from JWT payload
    const message = await this.userService.verifyOtp(userId, verifyOtpDto);
    return { message };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('emailSend')
  @ApiOperation({ summary: 'emailSend testing' })
  @ApiResponse({ status: 201, description: 'email sending successfully.' })
  @ApiResponse({ status: 400, description: 'Error email sending.' })
  async signup(@Body() emailDto: any) {
    try {
      return await this.userService.emailSending(emailDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('phoneOtpSend')
  @ApiOperation({ summary: 'phoneOtpSend testing' })
  @ApiResponse({ status: 201, description: 'phone Otp sending successfully.' })
  @ApiResponse({ status: 400, description: 'Error phone Otp sending.' })
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    try {
      await this.userService.sendOtp(phoneNumber);
      return { message: 'OTP sent successfully' };
    } catch (error) {
      throw error;
    }
  }
}
