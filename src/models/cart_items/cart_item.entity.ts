import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";
import { CartEntity } from "models/carts/cart.entity";

@Entity({ name: "cart_items" })
export class CartItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cart_id", type: "varchar" })
  cartId: string;

  @Column({ name: "meal_id", type: "varchar" })
  mealId: string;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart: CartEntity;

  static async findByParams(
    params: FindOptionsWhere<CartItemEntity>,
  ): Promise<CartItemEntity> {
    return this.getRepository().findOne({ where: params });
  }
  static async createCartItem(
    data: Partial<CartItemEntity>,
  ): Promise<CartItemEntity> {
    return this.getRepository().save(data);
  }

  static async updateCartItem(
    criteria: FindOptionsWhere<CartItemEntity>,
    data: Partial<CartItemEntity>,
  ): Promise<CartItemEntity> {
    await this.getRepository().update(criteria, data);
    const cartItem = await this.findByParams(criteria);
    return cartItem!;
  }

  static async deleteCartItem(criteria: FindOptionsWhere<CartItemEntity>) {
    await this.getRepository().delete(criteria);
  }
}
