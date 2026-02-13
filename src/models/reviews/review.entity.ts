import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  FindOptionsWhere,
  CreateDateColumn,
  UpdateDateColumn,
  MoreThan,
} from "typeorm";

@Entity({ name: "reviews" })
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @Column({ name: "rating", type: "int", default: 0 })
  rating: number;

  @Column({ name: "comment", type: "text" })
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

  static async getReviews(
    criteria: FindOptionsWhere<ReviewEntity>,
    count: number = 10,
  ): Promise<ReviewEntity[] | null> {
    return this.find({
      where: criteria,
      order: { createdAt: "DESC" },
      take: count,
    });
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

  static async countReviewsByCookId(cookId: string): Promise<number> {
    return this.getRepository().count({ where: { cookId } });
  }

  static async countCookRating(cookId: string): Promise<number> {
    return this.getRepository().count({
      where: { cookId, rating: MoreThan(0) },
    });
  }
}
