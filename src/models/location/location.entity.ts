import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "locations" })
export class LocationEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "latitude", type: "decimal", nullable: false })
  latitude: number;

  @Column({ name: "longitude", type: "decimal", nullable: false })
  longitude: number;

  @Column({ name: "country", type: "varchar", length: 100 })
  country: string;

  @Column({ name: "address", type: "varchar", length: 255 })
  address: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
