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
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("mongoose");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_2.Logger(DatabaseService_1.name);
        this.retryAttempts = 0;
        this.maxRetryAttempts = 5;
        this.retryDelay = 5000;
    }
    async onModuleInit() {
        await this.connectWithRetry();
    }
    async connectWithRetry() {
        try {
            if (this.retryAttempts >= this.maxRetryAttempts) {
                this.logger.error('Max retry attempts reached. Unable to connect to MongoDB.');
                process.exit(1);
            }
            const uri = this.configService.get('config.database.uri');
            if (!uri) {
                this.logger.error('MongoDB URI is not defined in environment variables');
                process.exit(1);
            }
            this.logger.log('Attempting to connect to MongoDB...');
            await mongoose_1.default.connect(uri, {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
                heartbeatFrequencyMS: 30000,
            });
            mongoose_1.default.connection.on('connected', () => {
                this.logger.log('Successfully connected to MongoDB');
                this.retryAttempts = 0;
            });
            mongoose_1.default.connection.on('error', (error) => {
                this.logger.error('MongoDB connection error:', error);
                this.retryAttempts++;
                setTimeout(() => this.connectWithRetry(), this.retryDelay);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                this.logger.warn('MongoDB disconnected. Attempting to reconnect...');
                this.retryAttempts++;
                setTimeout(() => this.connectWithRetry(), this.retryDelay);
            });
        }
        catch (error) {
            this.logger.error('Failed to connect to MongoDB:', error);
            this.retryAttempts++;
            setTimeout(() => this.connectWithRetry(), this.retryDelay);
        }
    }
    async onModuleDestroy() {
        try {
            await mongoose_1.default.disconnect();
            this.logger.log('MongoDB connection closed');
        }
        catch (error) {
            this.logger.error('Error while closing MongoDB connection:', error);
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map