import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1551105232669 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "users" (
          "id" SERIAL NOT NULL,
          "name" character varying(50) NOT NULL,
          "password" character varying(100) NOT NULL,
          "email" character varying(100) NOT NULL,
          CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
          PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
