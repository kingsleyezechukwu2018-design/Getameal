import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartEntity } from "models/carts/cart.entity";

@Entity({ name: "cart_items" })
export class CartItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cart_id", type: "varchar" })
  cartId: string;

  @Column({ name: "meal_id", type: "varchar" })
  mealId: string;

  @Column({ type: "int" })
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
}
