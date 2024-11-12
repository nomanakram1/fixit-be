import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlanEntity } from './entity/subscriptionPlan.entity';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/subscriptionPlan.dto';

@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlanEntity)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    ) {}

    // Create a new subscription plan
    async createSubscriptionPlan(
        createSubscriptionPlanDto: CreateSubscriptionPlanDto,
    ): Promise<SubscriptionPlanEntity> {
        const { name } = createSubscriptionPlanDto;

        try {
            // Check if a plan with the same name already exists
            const existingPlan = await this.subscriptionPlanRepository.findOne({ where: { name } });
            if (existingPlan) {
                throw new ConflictException(`Subscription plan with name ${name} already exists`);
            }

            const subscriptionPlan = this.subscriptionPlanRepository.create(createSubscriptionPlanDto);
            return await this.subscriptionPlanRepository.save(subscriptionPlan);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create subscription plan');
        }
    }

    // Get all subscription plans
    async getAllSubscriptionPlans(): Promise<SubscriptionPlanEntity[]> {
        try {
            return await this.subscriptionPlanRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve subscription plans');
        }
    }

    // Get a subscription plan by ID
    async getSubscriptionPlanById(id: string): Promise<SubscriptionPlanEntity> {
        try {
            const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
            if (!subscriptionPlan) {
                throw new NotFoundException(`Subscription plan with ID ${id} not found`);
            }
            return subscriptionPlan;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve subscription plan');
        }
    }

    // Update a subscription plan by ID
    async updateSubscriptionPlan(
        id: string,
        updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
    ): Promise<SubscriptionPlanEntity> {
        try {
            const subscriptionPlan = await this.getSubscriptionPlanById(id);

            // Update subscription plan data
            Object.assign(subscriptionPlan, updateSubscriptionPlanDto);
            return await this.subscriptionPlanRepository.save(subscriptionPlan);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update subscription plan');
        }
    }

    // Delete a subscription plan by ID
    async deleteSubscriptionPlan(id: string): Promise<void> {
        try {
            const result = await this.subscriptionPlanRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Subscription plan with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete subscription plan');
        }
    }
}