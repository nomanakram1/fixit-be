import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscriptionPlanEntity } from './entity/userSubscriptionPlan.entity';
import { CreateUserSubscriptionPlanDto, UpdateUserSubscriptionPlanDto } from './dto/userSubscriptionPlan.dto';
import { SubscriptionPlanEntity } from 'src/subscriptionPlan/entity/subscriptionPlan.entity';
import { UsersEntity } from 'src/user/entity/user.entity';

@Injectable()
export class UserSubscriptionPlanService {
    constructor(
        @InjectRepository(UserSubscriptionPlanEntity)
        private readonly userSubscriptionPlanRepository: Repository<UserSubscriptionPlanEntity>,
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
        @InjectRepository(SubscriptionPlanEntity)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    ) { }

    // Create a new user subscription plan
    async createUserSubscriptionPlan(
        createUserSubscriptionPlanDto: CreateUserSubscriptionPlanDto,
    ): Promise<UserSubscriptionPlanEntity> {
        const { userId, subscriptionPlanId } = createUserSubscriptionPlanDto;

        try {
            // Fetch the subscription plan using subscriptionPlanId
            const subscriptionPlan = await this.subscriptionPlanRepository.findOne({
                where: { id: subscriptionPlanId },
            });

            if (!subscriptionPlan) {
                throw new NotFoundException(`Subscription plan with ID ${subscriptionPlanId} not found`);
            }

            // Fetch the user using userId
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            // Check if the user already has an active subscription with the same subscription plan
            const existingPlan = await this.userSubscriptionPlanRepository.findOne({
                where: {
                    user: { id: userId },
                    subscriptionPlan: { id: subscriptionPlanId },
                },
            });

            if (existingPlan) {
                throw new ConflictException(`User already has a subscription plan with ID ${subscriptionPlanId}`);
            }

            // Create the new subscription plan entry
            const newSubscriptionPlan = this.userSubscriptionPlanRepository.create(createUserSubscriptionPlanDto);
            newSubscriptionPlan.user = user; 
            newSubscriptionPlan.subscriptionPlan = subscriptionPlan; 

            return await this.userSubscriptionPlanRepository.save(newSubscriptionPlan);
        } catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create user subscription plan');
        }
    }


    // Get all subscription plans with user details
    async getAllUserSubscriptionPlans(): Promise<UserSubscriptionPlanEntity[]> {
        try {
            return await this.userSubscriptionPlanRepository.find({
                relations: ['user'], // Include user details in the result
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve all user subscription plans');
        }
    }

    // Get a user subscription plan by ID
    async getUserSubscriptionPlanById(id: string): Promise<UserSubscriptionPlanEntity> {
        try {
            const subscriptionPlan = await this.userSubscriptionPlanRepository.findOne({ where: { id } });
            if (!subscriptionPlan) {
                throw new NotFoundException(`User subscription plan with ID ${id} not found`);
            }
            return subscriptionPlan;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve user subscription plan');
        }
    }

    // Update a user subscription plan by ID
    async updateUserSubscriptionPlan(
        id: string,
        updateUserSubscriptionPlanDto: UpdateUserSubscriptionPlanDto,
    ): Promise<UserSubscriptionPlanEntity> {
        try {
            const subscriptionPlan = await this.getUserSubscriptionPlanById(id);

            // Update user subscription plan data
            Object.assign(subscriptionPlan, updateUserSubscriptionPlanDto);
            return await this.userSubscriptionPlanRepository.save(subscriptionPlan);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update user subscription plan with ID ${id}`);
        }
    }

    // Delete a user subscription plan by ID
    async deleteUserSubscriptionPlan(id: string): Promise<void> {
        try {
            const result = await this.userSubscriptionPlanRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`User subscription plan with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to delete user subscription plan with ID ${id}`);
        }
    }

    // Get all user subscriptions by user ID
    async getUserSubscriptionsByUserId(userId: string): Promise<UserSubscriptionPlanEntity[]> {
        try {
            return await this.userSubscriptionPlanRepository.find({ where: { user: { id: userId } } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve subscriptions for user with ID ${userId}`);
        }
    }
}
