import { AuthProvidersEnum } from "src/auth/auth-providers.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: String, unique: true, length: 100 })
  email: string | null;

  @Index()
  @Column({ type: String, unique: true, length: 100 })
  username: string | null;

  @Column({ type: 'varchar', length: 255 })
  password: string | undefined;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Column({ type: String, nullable: true, length: 50 })
  firstName: string | null;

  @Column({ type: String, nullable: true, length: 50 })
  lastName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['customer', 'professional'], nullable: true })
  userType: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}