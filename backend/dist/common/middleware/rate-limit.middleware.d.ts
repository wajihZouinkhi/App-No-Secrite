import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly windowMs;
    private readonly maxRequests;
    private readonly ipRequests;
    use(req: Request, res: Response, next: NextFunction): void;
}
