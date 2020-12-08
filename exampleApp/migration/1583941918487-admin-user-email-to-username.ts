import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminUserEmailToUsername1583941918487 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "adminUser" RENAME COLUMN "email" TO "username"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "adminUser" RENAME CONSTRAINT "UQ_2461a300fe1ed769d7a96fa054b" TO "UQ_58bd2b086488ba1ba90847a192e"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "adminUser" RENAME CONSTRAINT "UQ_58bd2b086488ba1ba90847a192e" TO "UQ_2461a300fe1ed769d7a96fa054b"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "adminUser" RENAME COLUMN "username" TO "email"`,
      undefined,
    );
  }
}
