import { DevicePlatform } from "controllers/deviceToken/types_deviceToken";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  FindOptionsWhere,
} from "typeorm";

@Entity({ name: "device_tokens" })
export class DeviceTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "character varying" })
  userId: string;

  @Column({ name: "platform", type: "character varying" })
  platform: DevicePlatform;

  @Column({ name: "token", type: "character varying" })
  token: string;

  @Column({ name: "is_deleted", type: "boolean", default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  //static methods can be added here as needed
  static async createDeviceToken(params: Partial<DeviceTokenEntity>) {
    return this.getRepository().save(params);
  }

  static async updateDeviceToken(
    id: string,
    params: Partial<DeviceTokenEntity>,
  ) {
    await this.getRepository().update({ id }, params);
    return this.getRepository().findOne({ where: { id } });
  }

  static async findByParams(
    params: FindOptionsWhere<DeviceTokenEntity>,
  ): Promise<DeviceTokenEntity> {
    return this.getRepository().findOne({ where: params });
  }

  static async getTokens(
    offset: number,
    limit: number,
  ): Promise<string[]> {
    const devicesTokens = await this.getRepository()
      .createQueryBuilder("dt")
      .select(["dt.token"])
      .limit(limit)
      .offset(offset)
      .getMany();

    return devicesTokens.map(device => device.token);
  }
}
