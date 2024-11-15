import { UserSubscriptionPlanEntity } from 'src/userSubscriptionPlan/entity/userSubscriptionPlan.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'subscriptionPlans' })
export class SubscriptionPlanEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'float', nullable: true })
    discountedPrice: number | null;

    @Column({ type: 'int' })
    duration: number;

    @Column('simple-array', { nullable: true })
    features: string[] | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @OneToMany(() => UserSubscriptionPlanEntity, (userSubscriptionPlan) => userSubscriptionPlan.subscriptionPlan)
    userSubscriptions: UserSubscriptionPlanEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
