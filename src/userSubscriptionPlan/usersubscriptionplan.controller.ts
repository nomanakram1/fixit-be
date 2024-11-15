import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserSubscriptionPlanService } from './usersubscriptionplan.service';
import { CreateUserSubscriptionPlanDto, UpdateUserSubscriptionPlanDto } from './dto/userSubscriptionPlan.dto';
import { UserSubscriptionPlanEntity } from './entity/userSubscriptionPlan.entity';

@ApiTags('user-subscription-plans')
@Controller('user-subscription-plans')
export class UserSubscriptionPlanController {
    constructor(private readonly userSubscriptionPlanService: UserSubscriptionPlanService) { }

    // Create a new user subscription plan
    @Post()
    @ApiOperation({ summary: 'Create a new user subscription plan' })
    @ApiResponse({ status: 201, description: 'User subscription plan created successfully.' })
    @ApiResponse({ status: 400, description: 'Failed to create user subscription plan.' })
    async createUserSubscriptionPlan(
        @Body() dto: CreateUserSubscriptionPlanDto,
    ): Promise<{ message: string; data: UserSubscriptionPlanEntity }> {
        try {
            const subscriptionPlan = await this.userSubscriptionPlanService.createUserSubscriptionPlan(dto);
            return { message: 'User subscription plan created successfully', data: subscriptionPlan };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to create user subscription plan', error.status || HttpStatus.BAD_REQUEST);
        }
    }

    // Retrieve a user subscription plan by ID
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a user subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'User subscription plan retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User subscription plan not found.' })
    async getUserSubscriptionPlanById(
        @Param('id') id: string,
    ): Promise<{ message: string; data: UserSubscriptionPlanEntity }> {
        try {
            const subscriptionPlan = await this.userSubscriptionPlanService.getUserSubscriptionPlanById(id);
            if (!subscriptionPlan) {
                throw new HttpException(`User subscription plan with ID ${id} not found`, HttpStatus.NOT_FOUND);
            }
            return { message: 'User subscription plan retrieved successfully', data: subscriptionPlan };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve user subscription plan', HttpStatus.BAD_REQUEST);
        }
    }

    // Retrieve all user subscription plans with user details
    @Get()
    @ApiOperation({ summary: 'Retrieve all user subscription plans with user details' })
    @ApiResponse({ status: 200, description: 'All user subscription plans retrieved successfully.' })
    @ApiResponse({ status: 500, description: 'Failed to retrieve user subscription plans.' })
    async getAllUserSubscriptionPlans(): Promise<{ message: string; data: UserSubscriptionPlanEntity[] }> {
        try {
            const subscriptionPlans = await this.userSubscriptionPlanService.getAllUserSubscriptionPlans();
            return { message: 'All user subscription plans retrieved successfully', data: subscriptionPlans };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to retrieve user subscription plans',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Update a user subscription plan by ID
    @Put(':id')
    @ApiOperation({ summary: 'Update a user subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'User subscription plan updated successfully.' })
    @ApiResponse({ status: 404, description: 'User subscription plan not found.' })
    async updateUserSubscriptionPlan(
        @Param('id') id: string,
        @Body() dto: UpdateUserSubscriptionPlanDto,
    ): Promise<{ message: string; data: UserSubscriptionPlanEntity }> {
        try {
            const updatedPlan = await this.userSubscriptionPlanService.updateUserSubscriptionPlan(id, dto);
            return { message: 'User subscription plan updated successfully', data: updatedPlan };
        } catch (error) {
            throw new HttpException(error.message || `Failed to update user subscription plan with ID ${id}`, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a user subscription plan by ID
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'User subscription plan deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User subscription plan not found.' })
    async deleteUserSubscriptionPlan(@Param('id') id: string): Promise<{ message: string }> {
        try {
            await this.userSubscriptionPlanService.deleteUserSubscriptionPlan(id);
            return { message: 'User subscription plan deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || `Failed to delete user subscription plan with ID ${id}`, HttpStatus.BAD_REQUEST);
        }
    }

    // Retrieve all subscription plans of a specific user
    @Get('user/:userId')
    @ApiOperation({ summary: 'Retrieve all subscription plans of a specific user' })
    @ApiResponse({ status: 200, description: 'User subscription plans retrieved successfully.' })
    async getUserSubscriptionsByUserId(
        @Param('userId') userId: string,
    ): Promise<{ message: string; data: UserSubscriptionPlanEntity[] }> {
        try {
            const subscriptions = await this.userSubscriptionPlanService.getUserSubscriptionsByUserId(userId);
            return { message: 'User subscription plans retrieved successfully', data: subscriptions };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve user subscription plans', HttpStatus.BAD_REQUEST);
        }
    }
}
