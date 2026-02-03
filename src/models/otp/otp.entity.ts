import { OtpType } from "controllers/otp/types_otp";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index,
  FindOptionsWhere,
} from "typeorm";

@Index("email_idx", ["email"])
@Entity({ name: "otp" })
export class OtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "code", type: "varchar", length: 6 })
  code: string;

  @Column({ name: "email", type: "varchar", length: 255 })
  email: string;

  @Column({ name: "expire_at", type: "timestamp" })
  expireAt: Date;

  @Column({ name: "is_used", type: "boolean", default: false })
  isUsed: boolean;

  @Column({ name: "type", type: "varchar", length: 50 })
  type: OtpType;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  /**
   * Create and save a new OTP record
   */
  static async createOtp(data: {
    code: string;
    email: string;
    expireAt: Date;
    type: OtpType;
  }): Promise<OtpEntity> {
    return this.getRepository().save(data);
  }

  /**
   * Find an OTP record by email
   */
  static async findByEmail(email: string): Promise<OtpEntity | null> {
    return this.getRepository().findOneBy({ email });
  }

  static async findByParams(
    param: FindOptionsWhere<OtpEntity>,
  ): Promise<OtpEntity> {
    return this.getRepository().findOneBy(param);
  }

  static async updateOtp(
    criteria: { email?: string; id?: string },
    params: Partial<OtpEntity>,
  ): Promise<OtpEntity> {
    const { email, id } = criteria;
    if (id) {
      await this.getRepository().update({ id }, params);
      return this.getRepository().findOneBy({ id });
    }

    if (criteria.email) {
      await this.getRepository().update({ email }, params);
      return this.findByEmail(email);
    }

    return null;
  }
}
//is used is false, update the record with new code, expiresAt, then return the updated record
//   static async updateOtpCode(email: string, code: string, expireAt: Date): Promise<void> {
//     await this.getRepository().update({ email, isUsed: false }, { code, expireAt });
//   }
// }

//when otp is confirmed as correct, mark it as used
