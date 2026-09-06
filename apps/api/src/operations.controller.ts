import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { Body, Controller, Get, Inject, Patch, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { OperationsService } from './operations.service';

class ApplicationDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsIn(['Service Engine', 'Asset Engine', 'Media Engine', 'Not sure yet'])
  engine!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  passions!: string[];

  @IsOptional()
  @IsString()
  otherPassion?: string;

  @IsString()
  @MinLength(20)
  bio!: string;

  @IsOptional()
  @IsUrl()
  portfolio?: string;
}

class ApprovalUpdateDto {
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'DECLINED'])
  status!: string;
}

@Controller('operations')
export class OperationsController {
  constructor(
    @Inject(OperationsService) private readonly operations: OperationsService,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  @Get('overview') overview(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.overview());
  }

  @Get('clients') clients(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.clients());
  }

  @Get('projects') projects(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.projects());
  }

  @Get('files') files(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.files());
  }

  @Get('approvals') approvals(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.approvals());
  }

  @Patch('approvals/:id') updateApproval(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: ApprovalUpdateDto,
  ) {
    return this.auth
      .currentUser(request)
      .then((user) => this.operations.updateApproval(user, id, body.status));
  }

  @Get('finance/invoices') invoices(@Req() request: Request) {
    return this.auth.currentUser(request).then(() => this.operations.invoices());
  }

  @Get('applications') applications(@Req() request: Request) {
    return this.auth.currentUser(request).then((user) => this.operations.applications(user));
  }

  @Get('applications/me') myApplication(@Req() request: Request) {
    return this.auth.currentUser(request).then((user) => this.operations.myApplication(user));
  }

  @Post('applications') createApplication(@Req() request: Request, @Body() body: ApplicationDto) {
    return this.auth
      .currentUser(request)
      .then((user) => this.operations.createApplication(user, body));
  }

  @Patch('applications/:id') updateApplication(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.auth
      .currentUser(request)
      .then((user) => this.operations.updateApplication(user, id, body));
  }
}
