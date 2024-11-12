import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { RoleEntity } from "../../roles/entity/roles.entity";
import { UsersEntity } from "../../user/entity/user.entity";

@Entity({ name: 'userToRole' })
export class UserToRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RoleEntity, role => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => UsersEntity, user => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @CreateDateColumn()
  assignedAt: Date;
}
