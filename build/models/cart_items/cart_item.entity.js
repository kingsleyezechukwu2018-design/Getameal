"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemEntity = void 0;
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("../../models/carts/cart.entity");
let CartItemEntity = class CartItemEntity {
};
exports.CartItemEntity = CartItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], CartItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cart_id", type: "varchar" })
], CartItemEntity.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meal_id", type: "varchar" })
], CartItemEntity.prototype, "mealId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" })
], CartItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], CartItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], CartItemEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cart_entity_1.CartEntity, (cart) => cart.items, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "cart_id" })
], CartItemEntity.prototype, "cart", void 0);
exports.CartItemEntity = CartItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "cart_items" })
], CartItemEntity);
//# sourceMappingURL=cart_item.entity.js.map