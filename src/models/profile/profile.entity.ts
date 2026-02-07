import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";

@Entity({ name: "profiles" })
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "bio", type: "text", nullable: true })
  bio: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async createProfile(
    data: Partial<ProfileEntity>,
  ): Promise<ProfileEntity> {
    return this.getRepository().save(data);
  }

  static async getProfile(
    criteria: FindOptionsWhere<ProfileEntity>,
  ): Promise<ProfileEntity | null> {
    return this.findOne({ where: criteria });
  }

  static async updateProfile(
    criteria: FindOptionsWhere<ProfileEntity>,
    data: Partial<ProfileEntity>,
  ): Promise<ProfileEntity | null> {
    await this.getRepository().update(criteria, data);
    return this.getProfile(criteria);
  }

  static async deleteProfile(
    criteria: FindOptionsWhere<ProfileEntity>,
  ): Promise<boolean> {
    const result = await this.getRepository().delete(criteria);
    return result.affected !== undefined && result.affected > 0;
  }
}
