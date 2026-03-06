import {
  Controller,
  Put,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserRole } from '@fsowemimo-d8b02f8a-4412-4cf4-a953-29470923d3a8/data/enums';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(':id')
  @UseGuards(AuthGuard('supabase-jwt'))
  async updateUser(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    const isSelf = req.user?.id === id;
    const role = req.user?.role;
    const isAdminOrOwner =
      role === UserRole.ADMIN || role === UserRole.OWNER;

    if (!isSelf && !isAdminOrOwner) {
      throw new ForbiddenException('Insufficient role to update this user');
    }

    return this.usersService.updateUser(id, updateData);
  }

  @Patch('preferences')
  @UseGuards(AuthGuard('supabase-jwt'))
  async updatePreferences(@Req() req: any, @Body() preferences: any) {
    return this.usersService.updateUser(req.user.id, { preferences });
  }
}
