import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { RoleEntity } from "../../roles/entity/roles.entity";
import { UsersEntity } from "../../user/entity/user.entity";

@Entity({ name: 'userToRole' })
export class UserToRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => RoleEntity, role => role.userRoles)
  @JoinColumn()
  role: RoleEntity;

  @ManyToOne(() => UsersEntity, user => user.userRoles)
  @JoinColumn()
  user: UsersEntity;

  @CreateDateColumn()
  assignedAt: Date;
}