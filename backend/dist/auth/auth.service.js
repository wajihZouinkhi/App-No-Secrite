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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../users/schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            throw new common_1.BadRequestException('Invalid input type');
        }
        return input.replace(/[\${}()]/g, '');
    }
    async register(createUserDto) {
        const { email, password, name } = createUserDto;
        const sanitizedEmail = this.sanitizeInput(email);
        const sanitizedName = this.sanitizeInput(name);
        const existingUser = await this.userModel.findOne({ email: sanitizedEmail }).exec();
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already exists');
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
    async login(email, password) {
        const user = await this.userModel.findOne({ email: email }).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials - User not found by query');
        }
        console.log(`Login successful for user ${user.email} via potentially injected query. Bypassing password check.`);
        const token = this.jwtService.sign({ userId: user._id });
        return { token, user: { email: user.email, name: user.name } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map