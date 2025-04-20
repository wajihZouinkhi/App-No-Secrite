import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      throw new BadRequestException('Invalid input type');
    }
    // Remove MongoDB operators and special characters
    return input.replace(/[\${}()]/g, '');
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    
    // Sanitize inputs
    const sanitizedEmail = this.sanitizeInput(email);
    const sanitizedName = this.sanitizeInput(name);
    
    const existingUser = await this.userModel.findOne({ email: sanitizedEmail }).exec();
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName,
    });

    const token = this.jwtService.sign({ userId: user._id });
    return { token, user: { email: user.email, name: user.name } };
  }

  async login(email: string, password: string) {
    // Sanitize email
    // const sanitizedEmail = this.sanitizeInput(email); // Removed sanitization
    
    // Intentionally vulnerable: use raw email input directly
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      // If the injection finds no user, still fail
      throw new UnauthorizedException('Invalid credentials - User not found by query');
    }

    // --- Password check intentionally removed for vulnerability demo ---
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }
    // --- End of removed password check ---

    console.log(`Login successful for user ${user.email} via potentially injected query. Bypassing password check.`);

    // If a user was found by the query, generate token immediately
    const token = this.jwtService.sign({ userId: user._id });
    return { token, user: { email: user.email, name: user.name } };
  }
}