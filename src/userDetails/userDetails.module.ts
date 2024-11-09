import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailsEntity } from './entity/userDetails.entity';
import { UserDetailsService } from './userDetails.service';
import { UserDetailsController } from './userDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetailsEntity])],
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
