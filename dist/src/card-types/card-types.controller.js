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
exports.CardTypesController = void 0;
const common_1 = require("@nestjs/common");
const card_types_service_1 = require("./card-types.service");
let CardTypesController = class CardTypesController {
    cardTypesService;
    constructor(cardTypesService) {
        this.cardTypesService = cardTypesService;
    }
    findAll() {
        return this.cardTypesService.findAll();
    }
};
exports.CardTypesController = CardTypesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CardTypesController.prototype, "findAll", null);
exports.CardTypesController = CardTypesController = __decorate([
    (0, common_1.Controller)('card-types'),
    __metadata("design:paramtypes", [card_types_service_1.CardTypesService])
], CardTypesController);
//# sourceMappingURL=card-types.controller.js.map