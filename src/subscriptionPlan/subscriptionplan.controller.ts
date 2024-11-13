import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscriptionplan.service';
import { SubscriptionPlanEntity } from './entity/subscriptionPlan.entity';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/subscriptionPlan.dto';

@ApiTags('subscription-plans')
@Controller('subscription-plans')
export class SubscriptionPlanController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlanService) { }

    // Create a new subscription plan
    @Post()
    @ApiOperation({ summary: 'Create a new subscription plan' })
    @ApiResponse({ status: 201, description: 'Subscription plan created successfully.' })
    @ApiResponse({ status: 400, description: 'Failed to create subscription plan.' })
    async createSubscriptionPlan(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<{ message: string; data: SubscriptionPlanEntity }> {
        try {
            const subscriptionPlan = await this.subscriptionPlanService.createSubscriptionPlan(createSubscriptionPlanDto);
            return { message: 'Subscription plan created successfully', data: subscriptionPlan };
        } catch (error) {
            throw new HttpException('Failed to create subscription plan', HttpStatus.BAD_REQUEST);
        }
    }

    // Get all subscription plans
    @Get()
    @ApiOperation({ summary: 'Retrieve all subscription plans' })
    @ApiResponse({ status: 200, description: 'Subscription plans retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Failed to retrieve subscription plans.' })
    async getAllSubscriptionPlans(): Promise<{ message: string; data: SubscriptionPlanEntity[] }> {
        try {
            const subscriptionPlans = await this.subscriptionPlanService.getAllSubscriptionPlans();
            return { message: 'Subscription plans retrieved successfully', data: subscriptionPlans };
        } catch (error) {
            throw new HttpException('Failed to retrieve subscription plans', HttpStatus.BAD_REQUEST);
        }
    }

    // Get a subscription plan by ID
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
    @ApiResponse({ status: 400, description: 'Failed to retrieve subscription plan.' })
    async getSubscriptionPlanById(@Param('id') id: string): Promise<{ message: string; data: SubscriptionPlanEntity }> {
        try {
            const subscriptionPlan = await this.subscriptionPlanService.getSubscriptionPlanById(id);
            if (!subscriptionPlan) {
                throw new HttpException(`Subscription plan with ID ${id} not found`, HttpStatus.NOT_FOUND);
            }
            return { message: 'Subscription plan retrieved successfully', data: subscriptionPlan };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve subscription plan', HttpStatus.BAD_REQUEST);
        }
    }

    // Update a subscription plan by ID
    @Put(':id')
    @ApiOperation({ summary: 'Update a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan updated successfully.' })
    @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
    @ApiResponse({ status: 400, description: 'Failed to update subscription plan.' })
    async updateSubscriptionPlan(
        @Param('id') id: string,
        @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
    ): Promise<{ message: string; data: SubscriptionPlanEntity }> {
        try {
            const updatedSubscriptionPlan = await this.subscriptionPlanService.updateSubscriptionPlan(id, updateSubscriptionPlanDto);
            return { message: 'Subscription plan updated successfully', data: updatedSubscriptionPlan };
        } catch (error) {
            throw new HttpException(error.message || `Failed to update subscription plan with ID ${id}`, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a subscription plan by ID
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
    @ApiResponse({ status: 400, description: 'Failed to delete subscription plan.' })
    async deleteSubscriptionPlan(@Param('id') id: string): Promise<{ message: string }> {
        try {
            await this.subscriptionPlanService.deleteSubscriptionPlan(id);
            return { message: 'Subscription plan deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || `Failed to delete subscription plan with ID ${id}`, HttpStatus.BAD_REQUEST);
        }
    }
}
