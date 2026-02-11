import {
    Auth,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  FindOptionsWhere,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum LoginOption {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  EMAIL = "EMAIL",
}

@Entity()
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "user_id" })
  userId: string;

  @Column("varchar", { name: "refresh_token", nullable: true })
  refreshToken: string;

  @Column("varchar", { name: "last_login_option", nullable: true })
  lastLoginOption: LoginOption;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  static async getAuthByParams(
    params: FindOptionsWhere<AuthEntity>,
  ): Promise<AuthEntity> {
    return this.getRepository().findOne({ where: params });
  }

  static async createAuth(data: Partial<AuthEntity>): Promise<AuthEntity> {
    return this.getRepository().save(data);
  }

  static async updateAuth(
    criteria: FindOptionsWhere<AuthEntity>,
    data: Partial<AuthEntity>,
  ): Promise<AuthEntity> {
    await this.getRepository().update(criteria, data);
    const auth = await this.getAuthByParams(criteria);

    return auth;
  }
}
