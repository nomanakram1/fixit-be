import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetailsEntity } from './entity/userDetails.entity';
import { CreateUserDetailsDto } from './dto/createUserDetials.dto';
import { UpdateUserDetailsDto } from './dto/UpdateUserDetials.dto';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetailsEntity)
    private readonly userDetailsRepository: Repository<UserDetailsEntity>,
  ) { }

  async createUserDetails(createUserDetailsDto: CreateUserDetailsDto): Promise<UserDetailsEntity> {
    const userDetails = this.userDetailsRepository.create(createUserDetailsDto);
    return this.userDetailsRepository.save(userDetails);
  }

  async getAllUserDetails(): Promise<UserDetailsEntity[]> {
    return this.userDetailsRepository.find({
      where: { isActive: true }
    });
  }

  async getUserDetailsById(id: string): Promise<UserDetailsEntity> {
    const userDetails = await this.userDetailsRepository.findOne({ where: { id, isActive: true } });
    if (!userDetails) {
      throw new NotFoundException(`User details with ID ${id} not found`);
    }
    return userDetails;
  }

  async updateUserDetails(id: string, updateUserDetailsDto: UpdateUserDetailsDto): Promise<UserDetailsEntity> {
    const userDetails = await this.getUserDetailsById(id);
    Object.assign(userDetails, updateUserDetailsDto);
    return this.userDetailsRepository.save(userDetails);
  }

  async deleteUserDetails(id: string): Promise<void> {
    // Find the user details by ID
    const userDetails = await this.userDetailsRepository.findOne({ where: { id, isActive: true } });

    if (!userDetails) {
      throw new NotFoundException(`User details with ID ${id} not found`);
    }

    // Set isActive to false instead of deleting the record
    userDetails.isActive = false;
    await this.userDetailsRepository.save(userDetails);
  }

}
