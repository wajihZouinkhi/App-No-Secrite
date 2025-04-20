import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100; // limit each IP to 100 requests per windowMs
  private readonly ipRequests = new Map<string, { count: number; resetTime: number }>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();

    // Initialize or reset the request count for this IP
    if (!this.ipRequests.has(ip) || now > this.ipRequests.get(ip)?.resetTime) {
      this.ipRequests.set(ip, { count: 1, resetTime: now + this.windowMs });
    } else {
      const current = this.ipRequests.get(ip);
      this.ipRequests.set(ip, { 
        count: current.count + 1, 
        resetTime: current.resetTime 
      });
    }

    const { count, resetTime } = this.ipRequests.get(ip);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));

    // Check if the IP has exceeded the rate limit
    if (count > this.maxRequests) {
      this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
      res.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
        retryAfter: Math.ceil((resetTime - now) / 1000),
      });
      return;
    }

    next();
  }
} 