import { MigrationInterface, QueryRunner } from 'typeorm';

export class userAddHireDatetime1566468754993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" ADD "hireDatetime" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hireDatetime"`);
  }
}
