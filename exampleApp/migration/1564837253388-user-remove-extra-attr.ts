import { MigrationInterface, QueryRunner } from 'typeorm';

export class userRemoveExtraAttr1564837253388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "text"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" ADD "text" text`);
  }
}
