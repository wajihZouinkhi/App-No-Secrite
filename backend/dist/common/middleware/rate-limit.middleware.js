"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RateLimitMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let RateLimitMiddleware = RateLimitMiddleware_1 = class RateLimitMiddleware {
    constructor() {
        this.logger = new common_2.Logger(RateLimitMiddleware_1.name);
        this.windowMs = 15 * 60 * 1000;
        this.maxRequests = 100;
        this.ipRequests = new Map();
    }
    use(req, res, next) {
        var _a;
        const ip = req.ip;
        const now = Date.now();
        if (!this.ipRequests.has(ip) || now > ((_a = this.ipRequests.get(ip)) === null || _a === void 0 ? void 0 : _a.resetTime)) {
            this.ipRequests.set(ip, { count: 1, resetTime: now + this.windowMs });
        }
        else {
            const current = this.ipRequests.get(ip);
            this.ipRequests.set(ip, {
                count: current.count + 1,
                resetTime: current.resetTime
            });
        }
        const { count, resetTime } = this.ipRequests.get(ip);
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
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
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = RateLimitMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map