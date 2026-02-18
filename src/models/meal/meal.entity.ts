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
import { Currency, DeliveryOption, QuantityUnit } from "./types_meal_entity";
import { UserEntity } from "models/users/users.entity";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { LocationEntity } from "models/location/location.entity";
import { ReviewEntity } from "models/reviews/review.entity";

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

  @Column({ name: "currency", type: "varchar", length: 10, default: "NGN" })
  currency: Currency;

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
    name: "next_available_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  nextAvailableDate: Date;

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

  @ManyToOne(() => UserEntity, (user) => user.meals)
  @JoinColumn({ name: "cook_id" })
  cook: UserEntity;

  static async createMeal(data: Partial<MealEntity>): Promise<MealEntity> {
    return this.getRepository().save(data);
  }

  static async getMeal(
    criteria: FindOptionsWhere<MealEntity>,
  ): Promise<MealEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async getMeals(
    criteria: FindOptionsWhere<MealEntity>,
    count: number = 10,
  ): Promise<MealEntity[] | null> {
    return this.find({
      where: criteria,
      take: Number(count),
      order: { createdAt: "DESC" },
    });
  }

  static async updateMeal(
    criteria: FindOptionsWhere<MealEntity>,
    data: Partial<MealEntity>,
  ): Promise<MealEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getMeal(criteria);
  }

  static async getMealByIdWithDetails(
    mealId: string,
  ): Promise<MealEntity | null> {
    const meal = await this.getRepository()
      .createQueryBuilder("meal")
      .innerJoinAndSelect("meal.cook", "cook", "cook.id = meal.cookId")
      .innerJoinAndSelect(UserLocationEntity, "ul", "ul.userId = cook.id")
      .innerJoinAndSelect("ul.location", "location", "location.id = ul.locationId")
      .leftJoinAndSelect(ReviewEntity, "reviews", "reviews.cookId = cook.id")
      .where("meal.id = :mealId", { mealId })
      .getRawOne();

    return meal;
  }

  //get all meals in the mealId array, join user table to get cook details, join user location to get location details
  static async getMealsByIdsWithDetails(mealIds: string[]): Promise<MealEntity[]> {
    const meals = await this.getRepository()
      .createQueryBuilder("meal")
      .innerJoinAndSelect("meal.cook", "cook", "cook.id = meal.cookId")
      .innerJoinAndSelect(UserLocationEntity, "ul", "ul.userId = cook.id")
      .innerJoinAndSelect("ul.location", "location", "location.id = ul.locationId")
      .where("meal.id IN (:...mealIds)", { mealIds })
      .getRawMany();

    return meals;
  }
}
