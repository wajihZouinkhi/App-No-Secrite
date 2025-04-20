import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private retryAttempts = 0;
  private readonly maxRetryAttempts = 5;
  private readonly retryDelay = 5000; // 5 seconds

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry(): Promise<void> {
    try {
      if (this.retryAttempts >= this.maxRetryAttempts) {
        this.logger.error('Max retry attempts reached. Unable to connect to MongoDB.');
        process.exit(1);
      }

      const uri = this.configService.get<string>('config.database.uri');
      
      if (!uri) {
        this.logger.error('MongoDB URI is not defined in environment variables');
        process.exit(1);
      }

      this.logger.log('Attempting to connect to MongoDB...');
      
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 30000,
      });

      mongoose.connection.on('connected', () => {
        this.logger.log('Successfully connected to MongoDB');
        this.retryAttempts = 0; // Reset retry attempts on successful connection
      });

      mongoose.connection.on('error', (error) => {
        this.logger.error('MongoDB connection error:', error);
        this.retryAttempts++;
        setTimeout(() => this.connectWithRetry(), this.retryDelay);
      });

      mongoose.connection.on('disconnected', () => {
        this.logger.warn('MongoDB disconnected. Attempting to reconnect...');
        this.retryAttempts++;
        setTimeout(() => this.connectWithRetry(), this.retryDelay);
      });

    } catch (error) {
      this.logger.error('Failed to connect to MongoDB:', error);
      this.retryAttempts++;
      setTimeout(() => this.connectWithRetry(), this.retryDelay);
    }
  }

  async onModuleDestroy() {
    try {
      await mongoose.disconnect();
      this.logger.log('MongoDB connection closed');
    } catch (error) {
      this.logger.error('Error while closing MongoDB connection:', error);
    }
  }
} 