import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToRoleEntity } from './entity/userToRoles.entity';
import { CreateUserToRoleDto, UpdateUserToRoleDto } from './dto/userToRoles.dto';

@Injectable()
export class UserToRolesService {
  constructor(
    @InjectRepository(UserToRoleEntity)
    private readonly userToRoleRepository: Repository<UserToRoleEntity>,
  ) {}

  // // Create a new user-to-role entry
  // async createUserToRole(createUserToRoleDto: CreateUserToRoleDto): Promise<UserToRoleEntity> {
  //   const userToRole = this.userToRoleRepository.create(createUserToRoleDto);
  //   return this.userToRoleRepository.save(userToRole);
  // }

  // Retrieve all user-to-role entries
  async getAllUserToRoles(): Promise<UserToRoleEntity[]> {
    return this.userToRoleRepository.find({ relations: ['user', 'role'] });
  }

  // Retrieve a single user-to-role entry by ID
  async getUserToRoleById(id: string): Promise<UserToRoleEntity> {
    const userToRole = await this.userToRoleRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
    if (!userToRole) {
      throw new NotFoundException(`UserToRole entry with ID ${id} not found`);
    }
    return userToRole;
  }

  // Update an existing user-to-role entry by ID
  async updateUserToRole(id: string, updateUserToRoleDto: UpdateUserToRoleDto): Promise<UserToRoleEntity> {
    const userToRole = await this.getUserToRoleById(id);
    Object.assign(userToRole, updateUserToRoleDto);
    return this.userToRoleRepository.save(userToRole);
  }

  // Delete a user-to-role entry by ID
  async deleteUserToRole(id: string): Promise<void> {
    const result = await this.userToRoleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserToRole entry with ID ${id} not found`);
    }
  }
}
