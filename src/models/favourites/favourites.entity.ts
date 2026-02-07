import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  FindOptionsWhere,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "favourites" })
export class FavouritesEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async createFavourite(
    data: Partial<FavouritesEntity>,
  ): Promise<FavouritesEntity> {
    return this.getRepository().save(data);
  }

  static async getFavourite(
    criteria: FindOptionsWhere<FavouritesEntity>,
  ): Promise<FavouritesEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateFavourite(
    criteria: FindOptionsWhere<FavouritesEntity>,
    data: Partial<FavouritesEntity>,
  ): Promise<FavouritesEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getFavourite(criteria);
  }

  static async deleteFavourite(
    criteria: FindOptionsWhere<FavouritesEntity>,
  ): Promise<boolean> {
    const result = await this.getRepository().delete(criteria);
    return result.affected !== undefined && result.affected > 0;
  }
}
