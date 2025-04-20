import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private retryAttempts;
    private readonly maxRetryAttempts;
    private readonly retryDelay;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private connectWithRetry;
    onModuleDestroy(): Promise<void>;
}
