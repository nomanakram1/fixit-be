import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { UserToRoleEntity } from "../../userToRoles/entity/userToRoles.entity";

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => UserToRoleEntity, userToRole => userToRole.role)
  // @JoinColumn()
  userRoles: UserToRoleEntity[];
}
