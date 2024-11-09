import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { UserDetailsEntity } from '../userDetails/entity/userDetails.entity';
import * as bcrypt from 'bcryptjs';
import { use } from 'passport';

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
      relations: ['details']
    });
    
  }

  findOne(id: string): Promise<UsersEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['details','userRoles']
    });
  }
  

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByUsername(username: string): Promise<UsersEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email: string): Promise<UsersEntity | undefined> {
    try{
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    }catch(e){
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async finduserAndDetailsByEmail(email: string): Promise<UsersEntity | undefined> {
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

  async create(user: Partial<UsersEntity>): Promise<UsersEntity> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = this.userRepository.create({ ...user, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  async save(user: UsersEntity): Promise<UsersEntity> {
    return this.userRepository.save(user);
  }
}
