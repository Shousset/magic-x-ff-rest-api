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
exports.RaritiesController = void 0;
const common_1 = require("@nestjs/common");
const rarities_service_1 = require("./rarities.service");
let RaritiesController = class RaritiesController {
    raritiesService;
    constructor(raritiesService) {
        this.raritiesService = raritiesService;
    }
    findAll() {
        return this.raritiesService.findAll();
    }
};
exports.RaritiesController = RaritiesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RaritiesController.prototype, "findAll", null);
exports.RaritiesController = RaritiesController = __decorate([
    (0, common_1.Controller)('rarities'),
    __metadata("design:paramtypes", [rarities_service_1.RaritiesService])
], RaritiesController);
//# sourceMappingURL=rarities.controller.js.map