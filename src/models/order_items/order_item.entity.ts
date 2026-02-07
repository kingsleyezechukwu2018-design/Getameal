import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { OrderEntity } from "../orders/order.entity";

export type OrderStatus = "pending" | "paid" | "cancelled" | "completed";

@Entity({ name: "order_items" })
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "varchar" })
  userId: string;

  @Column({ name: "cook_id", type: "varchar" })
  cookId: string;

  @Column({ name: "order_id", type: "varchar" })
  orderId: string;

  @Column({ name: "status", type: "varchar", length: 20, default: "pending" })
  status: OrderStatus;

  @Column({ name: "total_amount", type: "float" })
  totalAmount: number;

  @Column({
    name: "fulfillment_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  fulfillmentDate: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.id, { nullable: false })
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  static async createOrderItem(
    data: Partial<OrderItemEntity>,
  ): Promise<OrderItemEntity> {
    return this.getRepository().save(data);
  }

  static async getOrderItem(
    criteria: FindOptionsWhere<OrderItemEntity>,
  ): Promise<OrderItemEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateOrderItem(
    criteria: FindOptionsWhere<OrderItemEntity>,
    data: Partial<OrderItemEntity>,
  ): Promise<OrderItemEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getOrderItem(criteria);
  }

  static async deleteOrderItem(
    criteria: FindOptionsWhere<OrderItemEntity>,
  ): Promise<boolean> {
    const result = await this.getRepository().delete(criteria);
    return result.affected !== undefined && result.affected > 0;
  }
}
