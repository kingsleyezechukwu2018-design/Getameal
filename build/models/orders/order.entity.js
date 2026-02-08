"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEntity = void 0;
const order_item_entity_1 = require("../../models/order_items/order_item.entity");
const typeorm_1 = require("typeorm");
let OrderEntity = class OrderEntity extends typeorm_1.BaseEntity {
    static async createOrder(data) {
        return this.getRepository().save(data);
    }
    static async getOrder(criteria) {
        return this.findOne({ where: criteria });
    }
    static async updateOrder(criteria, data) {
        await this.getRepository().update(criteria, data);
        return this.getOrder(criteria);
    }
    static async deleteOrder(criteria) {
        const result = await this.getRepository().delete(criteria);
        return result.affected !== undefined && result.affected > 0;
    }
};
exports.OrderEntity = OrderEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], OrderEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_id", type: "uuid" })
], OrderEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meal_id", type: "uuid" })
], OrderEntity.prototype, "mealId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "quantity", type: "int" })
], OrderEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unit_price", type: "float" })
], OrderEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "delivery_option",
        type: "enum",
        enum: ["pickup", "delivery"],
    })
], OrderEntity.prototype, "deliveryOption", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], OrderEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], OrderEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItemEntity, (orderItem) => orderItem.order)
], OrderEntity.prototype, "orderItems", void 0);
exports.OrderEntity = OrderEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "orders" })
], OrderEntity);
//# sourceMappingURL=order.entity.js.map