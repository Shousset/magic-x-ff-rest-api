"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_service_1 = require("../prisma/prisma.service");
const password_1 = require("../src/auth/password");
const client_1 = require("@prisma/client");
async function main() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || username.trim().length === 0) {
        throw new Error('Set ADMIN_USERNAME before running this script');
    }
    if (!password || password.trim().length < 8) {
        throw new Error('Set ADMIN_PASSWORD (min 8 characters) before running this script');
    }
    const prisma = new prisma_service_1.PrismaService();
    await prisma.onModuleInit();
    const passwordHash = await (0, password_1.hashPassword)(password);
    const admin = await prisma.user.upsert({
        where: { username },
        create: { username, passwordHash, role: client_1.UserRole.ADMINISTRATOR },
        update: { passwordHash, role: client_1.UserRole.ADMINISTRATOR },
        select: { id: true, username: true, role: true },
    });
    console.log('Administrator ready:', admin);
    await prisma.$disconnect();
}
main().catch((error) => {
    console.error('Failed to create administrator:', error);
    process.exitCode = 1;
});
//# sourceMappingURL=create-admin.js.map