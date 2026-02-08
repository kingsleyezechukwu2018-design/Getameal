"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewEntity = void 0;
const typeorm_1 = require("typeorm");
let ReviewEntity = class ReviewEntity extends typeorm_1.BaseEntity {
    static async createReview(data) {
        return this.getRepository().save(data);
    }
    static async getReview(criteria) {
        return this.findOne({ where: criteria });
    }
    static async updateReview(criteria, data) {
        await this.getRepository().update(criteria, data);
        return this.getReview(criteria);
    }
    static async deleteReview(criteria) {
        const result = await this.getRepository().delete(criteria);
        return result.affected !== undefined && result.affected > 0;
    }
};
exports.ReviewEntity = ReviewEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], ReviewEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" })
], ReviewEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cook_id", type: "uuid" })
], ReviewEntity.prototype, "cookId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meal_id", type: "uuid" })
], ReviewEntity.prototype, "mealId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rating", type: "int", width: 1 })
], ReviewEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "comment", type: "text", nullable: true })
], ReviewEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], ReviewEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], ReviewEntity.prototype, "updatedAt", void 0);
exports.ReviewEntity = ReviewEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "reviews" })
], ReviewEntity);
//# sourceMappingURL=review.entity.js.map