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
import { use } from 'passport';
import { UpdateUserDto } from './dto/updateUser.dto';
import { VerifyOtpDto } from './dto/otp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(UserDetailsEntity)
    private userDetailsEntity: Repository<UserDetailsEntity>,
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.userRepository.find({
      relations: ['details', 'userRoles'],
    });
  }

  async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
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

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByUsername(username: string): Promise<UsersEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async findOneByEmail(email: string): Promise<UsersEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
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
        where: { email },
        relations: ['userDetailsEntity'], // Include UserDetailsEntity relationship
      });

      return user;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async create(signupDto: Partial<UsersEntity>): Promise<UsersEntity> {
    // Check if user already exists
    const existingUser =
      (await this.findOneByEmail(signupDto.email)) ||
      (await this.findOneByUsername(signupDto.username));
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const otp = '12345';
    try {
      const newUser = await this.userRepository.save({
        ...signupDto,
        verificationCode: otp,
      });
      return newUser;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    // Find user by ID
    const user = await this.findUserById(updateUserDto.id);
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

    if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
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
