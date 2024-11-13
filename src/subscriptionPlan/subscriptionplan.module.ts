import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from './entity/subscriptionPlan.entity';
import { SubscriptionPlanService } from './subscriptionplan.service';
import { SubscriptionPlanController } from './subscriptionplan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SubscriptionPlanEntity])],
    controllers: [SubscriptionPlanController],
    providers: [SubscriptionPlanService],
    exports: [SubscriptionPlanService]
})
export class SubscriptionPlanModule {}