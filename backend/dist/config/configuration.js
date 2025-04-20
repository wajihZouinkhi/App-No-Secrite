"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('config', () => {
    var _a, _b;
    return ({
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT, 10) || 3001,
        database: {
            uri: process.env.MONGODB_URI,
            options: {
                retryWrites: true,
                w: 'majority',
                appName: 'Cluster0',
            },
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiration: process.env.JWT_EXPIRATION || '1d',
        },
        frontend: {
            url: process.env.FRONTEND_URL,
        },
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
        },
        cors: {
            origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000'],
            methods: ((_b = process.env.CORS_METHODS) === null || _b === void 0 ? void 0 : _b.split(',')) || ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
            credentials: process.env.CORS_CREDENTIALS === 'true',
        },
        logging: {
            level: process.env.LOG_LEVEL || 'debug',
            format: process.env.LOG_FORMAT || 'json',
        },
    });
});
//# sourceMappingURL=configuration.js.map