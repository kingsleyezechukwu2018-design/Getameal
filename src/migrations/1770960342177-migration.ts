import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770960342177 implements MigrationInterface {
    name = 'Migration1770960342177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "meal_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number_country_code" character varying`);
        await queryRunner.query(`ALTER TABLE "meals" ADD "next_available_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "favourites" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "comment" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "rating" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "favourites" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "meals" DROP COLUMN "next_available_date"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number_country_code"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "meal_id" uuid NOT NULL`);
    }

}
