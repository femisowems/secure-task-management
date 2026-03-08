import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Team,
  Organization,
  User,
} from '@fsowemimo-d8b02f8a-4412-4cf4-a953-29470923d3a8/data';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Organization, User]),
    AuditModule,
    AuthModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
