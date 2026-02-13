import { LocationEntity } from "models/location/location.entity";
import { UserEntity } from "models/users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "user_locations" })
export class UserLocationEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "location_id", type: "uuid" })
  locationId: string;

  @OneToOne(() => LocationEntity, { eager: true })
  @JoinColumn({ name: "location_id", referencedColumnName: "id" })
  location: LocationEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async getLocationByUserId(userId: string) {
    const userLocation = await this.getRepository()
      .createQueryBuilder("user_location")
      .innerJoin("user_location.location", "location")
      .select([
        "location.state AS state",
        "location.country AS country",
        "location.city AS city",
        "location.latitude AS latitude",
        "location.longitude AS longitude",
        "user_location.user_id AS userId",
      ])
      .where("user_location.user_id = :userId", { userId })
      .getRawOne();

    return userLocation;
  }

  static async updateUserLocation(userId: string, locationId: string) {
    return this.getRepository()
      .createQueryBuilder()
      .update(UserLocationEntity)
      .set({ locationId })
      .where("user_id = :userId", { userId })
      .returning("*")
      .execute();
  }
}
