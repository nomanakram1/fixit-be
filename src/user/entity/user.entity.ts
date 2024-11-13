import { UserSubscriptionPlanEntity } from "src/userSubscriptionPlan/entity/userSubscriptionPlan.entity";
import { AuthProvidersEnum } from "../../auth/enum/auth-providers.enum";
import { UserDetailsEntity } from "../../userDetails/entity/userDetails.entity";
import { UserToRoleEntity } from "../../userToRoles/entity/userToRoles.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'user' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: String, unique: true, length: 100 })
  email: string | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Index()
  @Column({ type: String, unique: true, length: 100 })
  username: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | undefined;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Column({ type: 'enum', enum: ['customer', 'professional'], nullable: true })
  userType: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string | null;

  @Column({ nullable: true })
  verificationCodeExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => UserToRoleEntity, userToRole => userToRole.user)
  @JoinColumn()
  userRoles: UserToRoleEntity[];

  @OneToOne(() => UserDetailsEntity, details => details.user)
  @JoinColumn()
  details: UserDetailsEntity;

  @OneToMany(() => UserSubscriptionPlanEntity, (userSubscriptionPlan) => userSubscriptionPlan.user)
  subscriptionPlans: UserSubscriptionPlanEntity[];
}
