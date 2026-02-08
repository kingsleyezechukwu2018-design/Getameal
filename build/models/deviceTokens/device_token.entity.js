"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenEntity = void 0;
const typeorm_1 = require("typeorm");
let DeviceTokenEntity = class DeviceTokenEntity extends typeorm_1.BaseEntity {
    //static methods can be added here as needed
    static async createDeviceToken(params) {
        return this.getRepository().save(params);
    }
    static async updateDeviceToken(id, params) {
        await this.getRepository().update({ id }, params);
        return this.getRepository().findOne({ where: { id } });
    }
    static async findByParams(params) {
        return this.getRepository().findOne({ where: params });
    }
};
exports.DeviceTokenEntity = DeviceTokenEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], DeviceTokenEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "character varying" })
], DeviceTokenEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "platform", type: "character varying" })
], DeviceTokenEntity.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "token", type: "character varying" })
], DeviceTokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", type: "boolean", default: false })
], DeviceTokenEntity.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" })
], DeviceTokenEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" })
], DeviceTokenEntity.prototype, "updatedAt", void 0);
exports.DeviceTokenEntity = DeviceTokenEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "device_tokens" })
], DeviceTokenEntity);
//# sourceMappingURL=device_token.entity.js.map