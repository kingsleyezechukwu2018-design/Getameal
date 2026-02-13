import { UserRole } from "controllers/users/types_users";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "email", type: "varchar", length: 255 })
  email: string;

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName: string;

  @Column({ name: "is_complete", type: "boolean", default: false })
  isComplete: boolean;

  @Column({ name: "role", type: "varchar", length: 50, default: "USER" })
  role: UserRole;

  @Column({ name: "bio", type: "text", nullable: true })
  bio: string;

  @Column({ name: "profile_image_url", type: "varchar", nullable: true })
  profileImageUrl: string;

  @Column({ name: "phone_number", type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({
    name: "phone_number_country_code",
    type: "varchar",
    nullable: true,
  })
  phoneNumberCountryCode: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async findByParams(
    params: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.findOne({ where: params });
  }

  static async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.getRepository().save(data);
  }

  static async updateUser(
    criteria: FindOptionsWhere<UserEntity>,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.getRepository().update(criteria, data);
    const user = await this.findByParams(criteria);

    return user;
  }

  static async getUserByIdWithLocation(
    userId: string,
  ): Promise<UserEntity | null> {
    const user = await this.getRepository()
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.location", "location")
      .where("user.id = :userId", { userId })
      .getOne();

    return user;
  }
}
