import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { UserDetailsEntity } from '../userDetails/entity/userDetails.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { VerifyOtpDto } from './dto/otp.dto';
import { EmailService } from 'src/Email/email.service';
import { MobilePhoneOtpService } from 'src/Email/phoneNumberOtp.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(UserDetailsEntity)
    private userDetailsEntity: Repository<UserDetailsEntity>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly mobilePhoneOtpService: MobilePhoneOtpService,
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.userRepository.find({
      where: { isActive: true },
      relations: ['details', 'userRoles'],
    });
  }

  async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, isActive: true },
        relations: ['details', 'userRoles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Find the user first
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['details', 'userRoles', 'subscriptionPlans'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Set the user as inactive instead of deleting
      user.isActive = false;

      // If user has related details, make them inactive as well
      if (user.details) {
        user.details.isActive = false;
        await this.userDetailsEntity.save(user.details);
      }

      await this.userRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  async findOneByUsername(username: string): Promise<UsersEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { username, isActive: true } });
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async findOneByEmail(email: string): Promise<UsersEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email, isActive: true } });
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<UsersEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { phoneNumber } });
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async finduserAndDetailsByEmail(
    email: string,
  ): Promise<UsersEntity | undefined> {
    try {
      // Fetch user along with related user details
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        relations: ['userDetailsEntity'], // Include UserDetailsEntity relationship
      });

      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async emailSending(emailDto: any) {
    try {
      const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    /* Reset styles */
    body, table, td, a {
      text-decoration: none;
      color: inherit;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }
    .content {
      font-size: 16px;
      color: #666666;
      text-align: center;
      line-height: 1.5;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #4CAF50;
      padding: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 12px;
      color: #aaaaaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your Account</div>
    <div class="content">
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div class="otp">{{ OTP_CODE }}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    </div>
    <div class="footer">
      If you did not request this OTP, please ignore this email.
    </div>
  </div>
</body>
</html>
`;
      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      const htmlContent = htmlTemplate.replace('{{ OTP_CODE }}', otp);
      const emailRes = await this.emailService.sendMail(
        emailDto.email,
        'subject',
        otp,
        htmlContent,
      );
    } catch (e) {
      throw e;
    }
  }

  async signUpEmailSending(email, otp) {
    try {
      const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    /* Reset styles */
    body, table, td, a {
      text-decoration: none;
      color: inherit;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }
    .content {
      font-size: 16px;
      color: #666666;
      text-align: center;
      line-height: 1.5;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #4CAF50;
      padding: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 12px;
      color: #aaaaaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your Account</div>
    <div class="content">
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div class="otp">{{ OTP_CODE }}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    </div>
    <div class="footer">
      If you did not request this OTP, please ignore this email.
    </div>
  </div>
</body>
</html>
`;
      const htmlContent = htmlTemplate.replace('{{ OTP_CODE }}', otp);
      this.emailService.sendMail(
        email,
        'Fixit OTP',
        otp,
        htmlContent,
      );
    } catch (e) {
      throw e;
    }
  }

  async sendOtp(phoneNumber: string): Promise<void> {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpSent = await this.mobilePhoneOtpService.sendOtp(phoneNumber, otp);
    return otpSent;
  }

  async create(
    signupDto: Partial<UsersEntity>,
  ): Promise<{ user: Partial<UsersEntity>; jwt: string }> {
    try {
      let existingEmail;
      let existingPhoneNumber;
      // Check if user already exists
      if(signupDto.email){
        existingEmail = await this.findOneByEmail(signupDto.email);
      }
      if(signupDto.phoneNumber){
         existingPhoneNumber = await this.findOneByPhoneNumber(signupDto.phoneNumber);
      }
      const existingUserName = await this.findOneByUsername(signupDto.username);
      
      if (existingUserName) {
        throw new ConflictException('User Name already exists');
      }
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
      if (existingPhoneNumber) {
        throw new ConflictException('PhoneNumber already exists');
      }
      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      // const otp = '12345';
      //send OTP to Email
      if (signupDto.email) {
        this.signUpEmailSending(signupDto.email, otp);
      }
      // send OTP to phone number
      if (signupDto.phoneNumber) {
        this.mobilePhoneOtpService.sendOtp(signupDto.phoneNumber, otp);
      }
      if (signupDto.password) {
        const salt = await bcrypt.genSalt();
        signupDto.password = await bcrypt.hash(signupDto.password, salt);
      }

      const userProperties = await this.userRepository.save({
        ...signupDto,
        verificationCode: otp,
      });

      const user = {
        id: userProperties.id,
        email: userProperties.email,
        username: userProperties.username,
        isEmailVerified: userProperties.isEmailVerified,
        isPhoneVerified: userProperties.isPhoneVerified,
        userRoles: userProperties.userRoles,
        userType: userProperties.userType,
      };

      // Generate JWT token
      const payload = { username: user.username, userId: user.id };
      const token = this.jwtService.sign(payload);

      return { user, jwt: token };
    } catch (e) {
      throw e
    }
  }

  async save(user: UsersEntity): Promise<UsersEntity> {
    return this.userRepository.save(user);
  }

  async updateUserPassword(updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    // Find user by ID
    const user = await this.findUserById(updateUserDto.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updateUserObj = {
      password: updateUserDto.password, // This should be hashed if changed
    };
    // Update other user fields
    Object.assign(user, updateUserObj);
    // Save updated user entity
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async updateUser(userId, updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    // Find user by ID
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateUserObj = {
      // email: updateUserDto.email,
      // username: updateUserDto.username,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
      userType: updateUserDto.userType,
      isAdmin: updateUserDto.isAdmin,
      isActive: updateUserDto.isActive,
      phoneNumber: updateUserDto.phoneNumber,
      isPhoneVerified: updateUserDto.isPhoneVerified,
      isEmailVerified: updateUserDto.isEmailVerified,
    };

    const updateUserDetailsObj = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      profilePictureUrl: updateUserDto.profilePictureUrl,
      address: updateUserDto.address,
      latitude: updateUserDto.latitude,
      longitude: updateUserDto.longitude,
      bio: updateUserDto.bio,
      skills: updateUserDto.skills,
      rating: updateUserDto.rating,
      reviewCount: updateUserDto.reviewCount,
    };

    // Check if user details exist; if not, create new details
    let newDetails;
    if (!user.details) {
      newDetails = await this.userDetailsEntity.save({
        ...updateUserDetailsObj,
      });
      updateUserObj['details'] = newDetails.id;
    } else {
      // Update user details if provided in DTO
      Object.assign(user.details, updateUserObj);
      await this.userDetailsEntity.save(user.details);
    }
    // Update other user fields
    Object.assign(user, updateUserObj);

    // Save updated user entity
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifyOtp(userId: string, verifyOtpDto: VerifyOtpDto): Promise<string> {
    const { otp } = verifyOtpDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verificationCode !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (
      user.verificationCodeExpiresAt &&
      new Date() > user.verificationCodeExpiresAt
    ) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark the user's phone as verified
    user.isPhoneVerified = true;
    user.isEmailVerified = true;
    // user.verificationCode = null;
    // user.verificationCodeExpiresAt = null;

    await this.userRepository.save(user);

    return 'OTP verified successfully';
  }
}
