import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entity/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  // Create a new role
  async createRole(name: string, description?: string): Promise<RoleEntity> {
    // Check if role with the same name already exists
    const existingRole = await this.rolesRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException(`Role with name ${name} already exists`);
    }

    const role = this.rolesRepository.create({ name, description });
    return this.rolesRepository.save(role);
  }

  // Retrieve all roles
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesRepository.find({
      where: { isActive: true },
    });
  }

  // Retrieve a single role by ID
  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.rolesRepository.findOne({ where: { id, isActive: true } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  // Update an existing role by ID
  async updateRole(id: string, name?: string, description?: string): Promise<RoleEntity> {
    const role = await this.getRoleById(id);
    if (name) role.name = name;
    if (description) role.description = description;
    return this.rolesRepository.save(role);
  }

  // Delete a role by ID
  async deleteRole(id: string): Promise<void> {
    // Find the role by ID
    const role = await this.rolesRepository.findOne({ where: { id, isActive: true } });
  
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  
    // Set isActive to false instead of deleting
    role.isActive = false;
    await this.rolesRepository.save(role);
  }  
}
