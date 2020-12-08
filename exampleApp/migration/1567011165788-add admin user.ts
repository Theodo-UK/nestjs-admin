import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAdminUser1567011165788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "adminUser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "password" character varying(128) NOT NULL, CONSTRAINT "PK_f155e50a944f2658dc1ccb477a2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "adminUser"`);
  }
}
