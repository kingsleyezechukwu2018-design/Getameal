import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";
import { UserEntity } from "models/users/users.entity";
import { CartItemEntity } from "models/cart_items/cart_item.entity";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "varchar", unique: true })
  userId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
  })
  items: CartItemEntity[];

  @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  static async findByParams(
    params: FindOptionsWhere<CartEntity>,
  ): Promise<CartEntity> {
    return this.getRepository().findOne({ where: params });
  }

  static async createCartForUser(data: Partial<CartEntity>): Promise<CartEntity> {
    return this.getRepository().save(data);
  }

  static async updateCart(
    criteria: FindOptionsWhere<CartEntity>,
    data: Partial<CartEntity>,
  ): Promise<CartEntity> {
    await this.getRepository().update(criteria, data);
    const cart = await this.findByParams(criteria);
    return cart!;
  }
}
