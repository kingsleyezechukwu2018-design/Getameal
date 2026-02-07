import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";

export type QuantityUnit = "litre" | "pieces" | "packs";
export type DeliveryOption = "pickup" | "delivery" | "both";

@Entity({ name: "meals" })
export class MealEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @Column({ name: "meal_name", type: "varchar", length: 255 })
  mealName: string;

  @Column({ name: "description", type: "text" })
  description: string;

  @Column({ name: "category", type: "varchar", length: 100 })
  category: string;

  @Column({ name: "price", type: "float" })
  price: number;

  @Column({ name: "quantity_value", type: "float" })
  quantityValue: number;

  @Column({ name: "quantity_unit", type: "varchar", length: 20 })
  quantityUnit: QuantityUnit;

  @Column({ name: "image_url", type: "varchar", length: 255, nullable: true })
  imageUrl: string;

  @Column({ name: "available_date", type: "timestamp with time zone" })
  availableDate: Date;

  @Column({ name: "max_orders", type: "int" })
  maxOrders: number;

  @Column({ name: "remaining_orders", type: "int" })
  remainingOrders: number;

  @Column({ name: "order_deadline", type: "timestamp with time zone" })
  orderDeadline: Date;

  @Column({ name: "delivery_option", type: "varchar", length: 50 })
  deliveryOption: DeliveryOption;

  @Column({ name: "delivery_fee", type: "float", default: 0 })
  deliveryFee: number;

  @Column({
    name: "pickup_address",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  pickupAddress: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async createMeal(data: Partial<MealEntity>): Promise<MealEntity> {
    return this.getRepository().save(data);
  }

  static async getMeal(
    criteria: FindOptionsWhere<MealEntity>,
  ): Promise<MealEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateMeal(
    criteria: FindOptionsWhere<MealEntity>,
    data: Partial<MealEntity>,
  ): Promise<MealEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getMeal(criteria);
  }

  //Q: should the meal record be taken out of the database when deleted or should it be marked as deleted and hidden from users?
  //   static async deleteMeal(
  //     criteria: FindOptionsWhere<MealEntity>,
  //   ): Promise<boolean> {
  //     const result = await this.getRepository().delete(criteria);
  //     return result.affected !== undefined && result.affected > 0;
  //   }
}
