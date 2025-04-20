"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            throw new common_1.BadRequestException('Invalid input type');
        }
        return input.replace(/[\${}()]/g, '');
    }
    async findById(id) {
        const sanitizedId = this.sanitizeInput(id);
        return this.userModel.findById(sanitizedId).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email }).exec();
    }
    async updateProfile(userId, updateData) {
        const sanitizedUserId = this.sanitizeInput(userId);
        const sanitizedEmail = this.sanitizeInput(updateData.email);
        const user = await this.userModel.findById(sanitizedUserId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (sanitizedEmail !== user.email) {
            const existingUser = await this.userModel.findOne({ email: sanitizedEmail });
            if (existingUser) {
                throw new common_1.UnauthorizedException('Email already exists');
            }
        }
        user.name = updateData.name;
        user.email = sanitizedEmail;
        return user.save();
    }
    async changePassword(userId, currentPassword, newPassword) {
        const sanitizedUserId = this.sanitizeInput(userId);
        const user = await this.userModel.findById(sanitizedUserId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map