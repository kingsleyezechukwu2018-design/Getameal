"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
const typeorm_1 = require("typeorm");
let ProfileEntity = class ProfileEntity extends typeorm_1.BaseEntity {
    static async createProfile(data) {
        return this.getRepository().save(data);
    }
    static async getProfile(criteria) {
        return this.findOne({ where: criteria });
    }
    static async updateProfile(criteria, data) {
        await this.getRepository().update(criteria, data);
        return this.getProfile(criteria);
    }
    static async deleteProfile(criteria) {
        const result = await this.getRepository().delete(criteria);
        return result.affected !== undefined && result.affected > 0;
    }
};
exports.ProfileEntity = ProfileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], ProfileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" })
], ProfileEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "bio", type: "text", nullable: true })
], ProfileEntity.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], ProfileEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], ProfileEntity.prototype, "updatedAt", void 0);
exports.ProfileEntity = ProfileEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "profiles" })
], ProfileEntity);
//# sourceMappingURL=profile.entity.js.map