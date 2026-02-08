"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemEntity = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
let OrderItemEntity = class OrderItemEntity extends typeorm_1.BaseEntity {
    static async createOrderItem(data) {
        return this.getRepository().save(data);
    }
    static async getOrderItem(criteria) {
        return this.findOne({ where: criteria });
    }
    static async updateOrderItem(criteria, data) {
        await this.getRepository().update(criteria, data);
        return this.getOrderItem(criteria);
    }
    static async deleteOrderItem(criteria) {
        const result = await this.getRepository().delete(criteria);
        return result.affected !== undefined && result.affected > 0;
    }
};
exports.OrderItemEntity = OrderItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], OrderItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "varchar" })
], OrderItemEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cook_id", type: "varchar" })
], OrderItemEntity.prototype, "cookId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_id", type: "varchar" })
], OrderItemEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "status", type: "varchar", length: 20, default: "pending" })
], OrderItemEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_amount", type: "float" })
], OrderItemEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "fulfillment_date",
        type: "timestamp with time zone",
        nullable: true,
    })
], OrderItemEntity.prototype, "fulfillmentDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], OrderItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], OrderItemEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.OrderEntity, (order) => order.id, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "order_id" })
], OrderItemEntity.prototype, "order", void 0);
exports.OrderItemEntity = OrderItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "order_items" })
], OrderItemEntity);
//# sourceMappingURL=order_item.entity.js.map