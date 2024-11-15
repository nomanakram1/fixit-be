import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from 'src/subscriptionPlan/entity/subscriptionPlan.entity';
import { UsersEntity } from 'src/user/entity/user.entity';
import { UserSubscriptionPlanEntity } from './entity/userSubscriptionPlan.entity';
import { UserSubscriptionPlanController } from './usersubscriptionplan.controller';
import { UserSubscriptionPlanService } from './usersubscriptionplan.service';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, SubscriptionPlanEntity, UserSubscriptionPlanEntity])],
    controllers: [UserSubscriptionPlanController],
    providers: [UserSubscriptionPlanService],
    exports: [UserSubscriptionPlanService]
})
export class UserSubscriptionPlanModule { }
