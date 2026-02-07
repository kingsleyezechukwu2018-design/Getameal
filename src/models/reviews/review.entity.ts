import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  FindOptionsWhere,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "reviews" })
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @Column({ name: "meal_id", type: "uuid" })
  mealId: string;

  @Column({ name: "rating", type: "int", width: 1 })
  rating: number;

  @Column({ name: "comment", type: "text", nullable: true })
  comment: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async createReview(
    data: Partial<ReviewEntity>,
  ): Promise<ReviewEntity> {
    return this.getRepository().save(data);
  }

  static async getReview(
    criteria: FindOptionsWhere<ReviewEntity>,
  ): Promise<ReviewEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateReview(
    criteria: FindOptionsWhere<ReviewEntity>,
    data: Partial<ReviewEntity>,
  ): Promise<ReviewEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getReview(criteria);
  }

  static async deleteReview(
    criteria: FindOptionsWhere<ReviewEntity>,
  ): Promise<boolean> {
    const result = await this.getRepository().delete(criteria);
    return result.affected !== undefined && result.affected > 0;
  }
}
