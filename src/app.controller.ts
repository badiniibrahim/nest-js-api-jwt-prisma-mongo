import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { Role, UserRole } from './auth/decorators/role';
import { RoleGuard } from './auth/guard/role.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
