import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToRoleEntity } from './entity/userToRoles.entity';
import {
  CreateUserToRoleDto,
  UpdateUserToRoleDto,
} from './dto/userToRoles.dto';
import { UsersEntity } from '../user/entity/user.entity';
import { RoleEntity } from '../roles/entity/roles.entity';
import { UserService } from 'src/user/user.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserToRolesService {
  constructor(
    @InjectRepository(UserToRoleEntity)
    private readonly userToRoleRepository: Repository<UserToRoleEntity>,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    private readonly userService: UserService,
    private readonly rolesService: RolesService,
  ) {}

  // Create a new user-to-role entry
  async createUserToRole(
    createUserToRoleDto: CreateUserToRoleDto,
  ): Promise<UserToRoleEntity> {
    try {
      const { userId, roleId } = createUserToRoleDto;

      // Default to "customer" if no roleId is provided
      const role = roleId
        ? await this.rolesService.getRoleById(roleId)
        : await this.userService.findUserById(userId);

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user already has the role
      const existingRole = await this.userToRoleRepository.findOne({
        where: { user: { id: userId }, role: { id: roleId } },
        relations: ['user', 'role'],
      });

      if (existingRole) {
        throw new ConflictException(`User already has the ${role.id} role`);
      }

      const userToRole = this.userToRoleRepository.create({ user, role });
      return await this.userToRoleRepository.save(userToRole);
    } catch (e) {
      throw e;
    }
  }

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
  async updateUserToRole(
    id: string,
    updateUserToRoleDto: UpdateUserToRoleDto,
  ): Promise<UserToRoleEntity> {
    const { roleId } = updateUserToRoleDto;

    // Get the existing user-to-role entry by its ID
    const userToRole = await this.getUserToRoleById(id);

    // Find the role by its ID
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);

    // Check if the user already has the role assigned
    if (userToRole.role.id === role.id) {
      throw new ConflictException(`User already has the ${role.name} role`);
    }

    // Update the user-to-role entry with the new role
    userToRole.role = role;
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
