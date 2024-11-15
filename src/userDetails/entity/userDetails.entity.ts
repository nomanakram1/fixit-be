import { UsersEntity } from "../../user/entity/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'userDetails' })
export class UserDetailsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersEntity, user => user.id)
  @JoinColumn()
  user: UsersEntity;

  @Column({ type: String, nullable: true, length: 50 })
  firstName: string | null;

  @Column({ type: String, nullable: true, length: 50 })
  lastName: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  profilePictureUrl: string | null;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true, array: true })
  skills: string[] | null;

  @Column({ default: 0, type: 'int' })
  rating: number;

  @Column({ default: 0, type: 'int' })
  reviewCount: number;
}
