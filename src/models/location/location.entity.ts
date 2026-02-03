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

  @Column({ name: "place", type: "varchar", length: 255 })
  place: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async getLocationsGroupedByState() {
    const locations = await this.getRepository()
      .createQueryBuilder("location")
      .select("location.state", "state")
      .addSelect(
        `json_agg(json_build_object('place', location.place, 'latitude', location.latitude, 'longitude', location.longitude))`,
        "places",
      )
      .groupBy("location.state")
      .getRawMany();

    //sample response: [
    //   {
    //     state: "California",
    //     places: [
    //       { place: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    //       { place: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
    //     ],
    //   },
    // ];
    return locations.map((loc) => ({
      state: loc.state,
      places: loc.places, // Each place: { place, latitude, longitude }
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
}
