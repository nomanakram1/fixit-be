import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsPositive, IsNotEmpty, IsArray } from 'class-validator';

export class CreateSubscriptionPlanDto {
    @ApiProperty({
        description: 'Name of the subscription plan',
        example: 'Basic, Pro, Premium',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Detailed description of the plan',
        example: '',
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Price of the subscription plan',
        example: '50, 100',
    })
    @IsPositive()
    @IsInt()
    price: number;

    @ApiProperty({
        description: 'price after applying any discounts',
        example: '5%, 10%',
    })
    @IsPositive()
    @IsInt()
    @IsOptional()
    discountedPrice: number;

    @ApiProperty({
        description: 'Duration in months (e.g., 1 for monthly, 12 for yearly)',
        example: '1 for monthly, 12 for yearly',
    })
    @IsInt()
    duration: number;

    @ApiProperty({
        description: 'List of features included in the subscription plan',
        example: 'Unlimited access to all content',
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({
        description: 'Whether the subscription plan is active or not',
        example: 'true or false',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateSubscriptionPlanDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsPositive()
    @IsInt()
    price?: number;

    @IsOptional()
    @IsInt()
    duration?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}