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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const password_1 = require("../auth/password");
const PUBLIC_USER_SELECT = {
    id: true,
    username: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};
function toPublicUser(user) {
    const { id, username, role, createdAt, updatedAt } = user;
    return { id, username, role, createdAt, updatedAt };
}
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const passwordHash = await (0, password_1.hashPassword)(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: { username: dto.username, role: dto.role, passwordHash },
                select: PUBLIC_USER_SELECT,
            });
            return toPublicUser(user);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException('Username already exists');
            }
            throw error;
        }
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: PUBLIC_USER_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return toPublicUser(user);
    }
    findCredentialsByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
            select: { id: true, passwordHash: true },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map