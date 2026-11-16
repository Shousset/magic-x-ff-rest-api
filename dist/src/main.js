"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const helmet_1 = __importDefault(require("helmet"));
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app_module_1 = require("./app.module");
function resolveAllowedOrigins() {
    const raw = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL;
    if (raw && raw.trim().length > 0) {
        return raw
            .split(',')
            .map((o) => o.trim())
            .filter((o) => o.length > 0);
    }
    return ['http://localhost:3000', 'http://localhost:3004'];
}
function isProduction() {
    return process.env.NODE_ENV === 'production';
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const prod = isProduction();
    const allowedOrigins = resolveAllowedOrigins();
    app.enableCors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('CORS no permitido'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: prod
            ? {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:', 'http:'],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    frameAncestors: ["'none'"],
                    baseUri: ["'self'"],
                    formAction: ["'self'"],
                },
            }
            : false,
        hsts: prod
            ? {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            }
            : false,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        crossOriginResourcePolicy: { policy: 'same-origin' },
        xContentTypeOptions: true,
        xDnsPrefetchControl: { allow: false },
        xDownloadOptions: true,
        xFrameOptions: { action: 'deny' },
        xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
        xPoweredBy: false,
    }));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: prod ? 200 : 300,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            error: 'Too many requests',
            message: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
        },
        skip: prod
            ? undefined
            : (req) => req.ip === '::1' || req.ip === '127.0.0.1',
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
    }));
    const port = process.env.PORT ?? 3003;
    await app.listen(port);
    logger.log(`🚀 API escuchando en puerto ${port} (${prod ? 'PRODUCCIÓN' : 'DESARROLLO'})`);
    logger.log(`🔒 CORS: ${allowedOrigins.join(', ')}`);
}
void bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exitCode = 1;
});
//# sourceMappingURL=main.js.map