import { MigrationInterface, QueryRunner } from 'typeorm';

export class userAddAllTypesAttrs1564837024241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "text" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "weight" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "age" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "numberOfSiblings" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "fingerCount" smallint`);
    await queryRunner.query(`ALTER TABLE "users" ADD "atomCount" bigint`);
    await queryRunner.query(`ALTER TABLE "users" ADD "height" double precision`);
    await queryRunner.query(`ALTER TABLE "users" ADD "bmi" numeric`);
    await queryRunner.query(`ALTER TABLE "users" ADD "birthdate" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deathdate" date`);
    await queryRunner.query(`ALTER TABLE "users" ADD "birthtime" TIME`);
    await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean`);
    await queryRunner.query(`ALTER TABLE "users" ADD "additionalData" json`);
    await queryRunner.query(`CREATE TYPE "users_gender_enum" AS ENUM('male', 'female', 'other')`);
    await queryRunner.query(`ALTER TABLE "users" ADD "gender" "users_gender_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdDate"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "users_gender_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "additionalData"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthtime"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathdate"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthdate"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bmi"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "atomCount"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fingerCount"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numberOfSiblings"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "text"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(50) NOT NULL`);
  }
}
