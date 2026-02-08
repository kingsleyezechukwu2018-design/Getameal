"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpEntity = void 0;
const typeorm_1 = require("typeorm");
let OtpEntity = class OtpEntity extends typeorm_1.BaseEntity {
    /**
     * Create and save a new OTP record
     */
    static async createOtp(data) {
        return this.getRepository().save(data);
    }
    /**
     * Find an OTP record by email
     */
    static async findByEmail(email) {
        return this.getRepository().findOneBy({ email });
    }
    static async findByParams(param) {
        return this.getRepository().findOneBy(param);
    }
    static async updateOtp(criteria, params) {
        const { email, id } = criteria;
        if (id) {
            await this.getRepository().update({ id }, params);
            return this.getRepository().findOneBy({ id });
        }
        if (criteria.email) {
            await this.getRepository().update({ email }, params);
            return this.findByEmail(email);
        }
        return null;
    }
};
exports.OtpEntity = OtpEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], OtpEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "code", type: "varchar", length: 6 })
], OtpEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email", type: "varchar", length: 255 })
], OtpEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "expire_at", type: "timestamp" })
], OtpEntity.prototype, "expireAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_used", type: "boolean", default: false })
], OtpEntity.prototype, "isUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "type", type: "varchar", length: 50 })
], OtpEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], OtpEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], OtpEntity.prototype, "updatedAt", void 0);
exports.OtpEntity = OtpEntity = __decorate([
    (0, typeorm_1.Index)("email_idx", ["email"]),
    (0, typeorm_1.Entity)({ name: "otp" })
], OtpEntity);
//is used is false, update the record with new code, expiresAt, then return the updated record
//   static async updateOtpCode(email: string, code: string, expireAt: Date): Promise<void> {
//     await this.getRepository().update({ email, isUsed: false }, { code, expireAt });
//   }
// }
//when otp is confirmed as correct, mark it as used
//# sourceMappingURL=otp.entity.js.map