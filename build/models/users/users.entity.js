"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity extends typeorm_1.BaseEntity {
    static async findByParams(params) {
        return this.findOne({ where: params });
    }
    static async createUser(data) {
        return this.getRepository().save(data);
    }
    static async updateUser(criteria, data) {
        await this.getRepository().update(criteria, data);
        const user = await this.findByParams(criteria);
        return user;
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email", type: "varchar", length: 255 })
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "full_name", type: "varchar", length: 255, nullable: true })
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_complete", type: "boolean", default: false })
], UserEntity.prototype, "isComplete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "role", type: "varchar", length: 50, default: "USER" })
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], UserEntity.prototype, "updatedAt", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], UserEntity);
//# sourceMappingURL=users.entity.js.map