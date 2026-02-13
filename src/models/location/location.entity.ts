import { MealEntity } from "models/meal/meal.entity";
import { UserEntity } from "models/users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  FindOptionsWhere,
  Index,
} from "typeorm";
import { Country } from "utils/types";
@Index(["latitude", "longitude"], { unique: true })
@Entity({ name: "locations" })
export class LocationEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "latitude", type: "decimal", nullable: false })
  latitude: number;

  @Column({ name: "longitude", type: "decimal", nullable: false })
  longitude: number;

  @Column({ name: "country", type: "varchar", length: 100 })
  country: Country;

  @Column({ name: "state", type: "varchar", length: 255 })
  state: string;

  @Column({ name: "city", type: "varchar", length: 255 })
  city: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async getLocationsGroupedByState({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }) {
    const locations = await this.getRepository()
      .createQueryBuilder("location")
      .select("location.state", "state")
      .addSelect(
        `json_agg(json_build_object('city', location.city, 'latitude', location.latitude, 'longitude', location.longitude))`,
        "cities",
      )
      .groupBy("location.state")
      .orderBy("location.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getRawMany();

    return locations.map((loc) => ({
      state: loc.state,
      cities: loc.cities,
    }));
  }

  static async findByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<LocationEntity> {
    return this.findOne({
      where: {
        latitude,
        longitude,
      } as FindOptionsWhere<LocationEntity>,
    });
  }

  static async createLocation(params: Partial<LocationEntity>) {
    return this.getRepository().save(params);
  }

  static async getCooksByLocation(latitude: number, longitude: number, count: number = 5) {
    const cooks = await this.getRepository()
      .createQueryBuilder("location")
      .innerJoin(UserEntity, "user", "user.id = user_location.user_id")
      .innerJoinAndSelect(MealEntity, "meal", "meal.user_id = user.id")
      .select([
        "user.id AS id",
        "user.full_name AS cook_fullName",
        "location.city AS city",
        "location.state AS state",
        "location.country AS country"
      ])
      .where(
        `ST_DistanceSphere(
          ST_MakePoint(location.longitude, location.latitude),
          ST_MakePoint(:longitude, :latitude)
        ) <= :radius`,
        { latitude, longitude, radius: 5000 },
      )
      .andWhere("user.role = 'COOK'")
      .limit(count)
      .getRawMany();
//join reviews  table to get average rating for each cook
    return cooks;
  }
}
