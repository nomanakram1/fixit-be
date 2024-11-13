import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../user/entity/user.entity';
import { SubscriptionPlanEntity } from '../../subscriptionPlan/entity/subscriptionPlan.entity';
import { SubscriptionStatus } from '../enum/userSubscriptionPlan.enum';

@Entity({ name: 'userSubscriptionPlans' })
export class UserSubscriptionPlanEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersEntity, (user) => user.subscriptionPlans)
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;

    @ManyToOne(() => SubscriptionPlanEntity, (subscription) => subscription.userSubscriptions)
    @JoinColumn({ name: 'subscriptionPlanId' })
    subscriptionPlan: SubscriptionPlanEntity;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date | null;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
    status: SubscriptionStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
