declare const _default: (() => {
    nodeEnv: string;
    port: number;
    database: {
        uri: string;
        options: {
            retryWrites: boolean;
            w: string;
            appName: string;
        };
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    frontend: {
        url: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        origin: string[];
        methods: string[];
        credentials: boolean;
    };
    logging: {
        level: string;
        format: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    database: {
        uri: string;
        options: {
            retryWrites: boolean;
            w: string;
            appName: string;
        };
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    frontend: {
        url: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        origin: string[];
        methods: string[];
        credentials: boolean;
    };
    logging: {
        level: string;
        format: string;
    };
}>;
export default _default;
