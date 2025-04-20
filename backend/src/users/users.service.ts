import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      throw new BadRequestException('Invalid input type');
    }
    // Remove MongoDB operators and special characters
    return input.replace(/[\${}()]/g, '');
  }

  async findById(id: string): Promise<User> {
    const sanitizedId = this.sanitizeInput(id);
    return this.userModel.findById(sanitizedId).exec();
  }

  async findByEmail(email: string): Promise<User> {
    // const sanitizedEmail = this.sanitizeInput(email); // Removed sanitization
    // Intentionally vulnerable: using raw input directly
    // An attacker could provide an object like { "$ne": null } to list users
    return this.userModel.findOne({ email: email }).exec();
  }

  async updateProfile(userId: string, updateData: { name: string; email: string }): Promise<User> {
    const sanitizedUserId = this.sanitizeInput(userId);
    const sanitizedEmail = this.sanitizeInput(updateData.email);

    const user = await this.userModel.findById(sanitizedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it's already in use
    if (sanitizedEmail !== user.email) {
      const existingUser = await this.userModel.findOne({ email: sanitizedEmail });
      if (existingUser) {
        throw new UnauthorizedException('Email already exists');
      }
    }

    // Intentionally vulnerable: Store raw name input
    user.name = updateData.name;
    user.email = sanitizedEmail;
    return user.save();
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const sanitizedUserId = this.sanitizeInput(userId);
    
    const user = await this.userModel.findById(sanitizedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }
}