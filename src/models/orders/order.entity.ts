import { DeliveryOption } from "models/meal/types_meal_entity";
import { OrderItemEntity } from "models/order_items/order_item.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  FindOptionsWhere,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "meal_id", type: "varchar" })
  mealId: string;

  @Column({ name: "quantity", type: "int" })
  quantity: number;

  @Column({ name: "unit_price", type: "float" })
  unitPrice: number;

  @Column({
    name: "delivery_option",
    type: "enum",
    enum: ["pickup", "delivery"],
  })
  deliveryOption: DeliveryOption

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  static async createOrder(data: Partial<OrderEntity>): Promise<OrderEntity> {
    return this.getRepository().save(data);
  }

  static async getOrder(
    criteria: FindOptionsWhere<OrderEntity>,
  ): Promise<OrderEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateOrder(
    criteria: FindOptionsWhere<OrderEntity>,
    data: Partial<OrderEntity>,
  ): Promise<OrderEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getOrder(criteria);
  }

  static async deleteOrder(
    criteria: FindOptionsWhere<OrderEntity>,
  ): Promise<boolean> {
    const result = await this.getRepository().delete(criteria);
    return result.affected !== undefined && result.affected > 0;
  }
}
