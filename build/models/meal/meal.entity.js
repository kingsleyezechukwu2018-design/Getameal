"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealEntity = void 0;
const typeorm_1 = require("typeorm");
let MealEntity = class MealEntity extends typeorm_1.BaseEntity {
    static async createMeal(data) {
        return this.getRepository().save(data);
    }
    static async getMeal(criteria) {
        return this.findOne({ where: criteria });
    }
    static async updateMeal(criteria, data) {
        await this.getRepository().update(criteria, data);
        return this.getMeal(criteria);
    }
};
exports.MealEntity = MealEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], MealEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cook_id", type: "uuid" })
], MealEntity.prototype, "cookId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meal_name", type: "varchar", length: 255 })
], MealEntity.prototype, "mealName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "description", type: "text" })
], MealEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "category", type: "varchar", length: 100 })
], MealEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "price", type: "float" })
], MealEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "quantity_value", type: "float" })
], MealEntity.prototype, "quantityValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "quantity_unit", type: "varchar", length: 20 })
], MealEntity.prototype, "quantityUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "image_url", type: "varchar", length: 255, nullable: true })
], MealEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "available_date", type: "timestamp with time zone" })
], MealEntity.prototype, "availableDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "max_orders", type: "int" })
], MealEntity.prototype, "maxOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "remaining_orders", type: "int" })
], MealEntity.prototype, "remainingOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_deadline", type: "timestamp with time zone" })
], MealEntity.prototype, "orderDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delivery_option", type: "varchar", length: 50 })
], MealEntity.prototype, "deliveryOption", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delivery_fee", type: "float", default: 0 })
], MealEntity.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "pickup_address",
        type: "varchar",
        length: 255,
        nullable: true,
    })
], MealEntity.prototype, "pickupAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], MealEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], MealEntity.prototype, "updatedAt", void 0);
exports.MealEntity = MealEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "meals" })
], MealEntity);
//# sourceMappingURL=meal.entity.js.map