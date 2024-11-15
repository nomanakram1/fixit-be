import { IsUUID, IsDateString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { SubscriptionStatus } from '../enum/userSubscriptionPlan.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSubscriptionPlanDto {
    @ApiProperty({
        description: 'ID of the user subscribing to the plan',
        example: 'd38bcd72-98b1-4edb-8a35-123456789abc',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'ID of the subscription plan',
        example: 'f29c9b32-7e7c-4b7e-9d77-654321abcdef',
    })
    @IsUUID()
    subscriptionPlanId: string;

    @ApiProperty({
        description: 'Start date of the subscription',
        example: '2024-01-01',
    })
    @IsDateString()
    startDate: Date;

    @ApiProperty({
        description: 'End date of the subscription',
        example: '2025-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: 'Status of the subscription (active or canceled or expired)',
        example: true,
    })
    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus = SubscriptionStatus.ACTIVE;
}


export class UpdateUserSubscriptionPlanDto {
    @ApiProperty({
        description: 'Updated end date of the subscription',
        example: '2025-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: 'Updated status of the subscription (active or canceled or expired)',
        example: true,
        required: false,
    })
    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus;
}
