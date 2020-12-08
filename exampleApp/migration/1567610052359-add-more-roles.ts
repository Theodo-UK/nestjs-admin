import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMoreRoles1567610052359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" ADD "moreRoles" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "moreRoles"`);
  }
}
