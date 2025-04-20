import { Controller, Get, Patch, Post, UseGuards, Request, Body, Query, UnauthorizedException, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Response } from 'express';

// Create DTOs for type safety
class UpdateProfileDto {
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    try {
      const updatedUser = await this.usersService.updateProfile(
        req.user.userId,
        updateProfileDto
      );
      return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to update profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePasswordPost(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    try {
      await this.usersService.changePassword(
        req.user.userId,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword
      );
      return { message: 'Password updated successfully via POST' };
    } catch (error) {
      throw new UnauthorizedException(`Failed to change password: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('change-password')
  async changePasswordGet(
    @Request() req,
    @Query('currentPassword') currentPassword: string,
    @Query('newPassword') newPassword: string
  ) {
    if (!currentPassword || !newPassword) {
      throw new UnauthorizedException('Missing currentPassword or newPassword query parameter');
    }
    if (newPassword.length < 6) {
       throw new UnauthorizedException('New password must be at least 6 characters long');
    }

    try {
      await this.usersService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      return { message: 'Password updated successfully via GET (Vulnerable)' };
    } catch (error) {
      throw new UnauthorizedException(`Failed to change password: ${error.message}`);
    }
  }

  // Intentionally vulnerable: Open Redirect endpoint
  @Get('redirect')
  @HttpCode(HttpStatus.FOUND) // Set appropriate redirect status code
  openRedirect(@Query('url') url: string, @Res() res: Response) {
    if (url) {
      console.warn(`Performing potentially unsafe redirect to: ${url}`);
      // No validation is performed on the URL!
      res.redirect(url);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send('Missing url query parameter');
    }
  }
}