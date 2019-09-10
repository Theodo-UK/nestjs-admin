import {MigrationInterface, QueryRunner} from "typeorm";

export class adminuserEmailUnique1567173563978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "adminUser" ADD CONSTRAINT "UQ_2461a300fe1ed769d7a96fa054b" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "adminUser" DROP CONSTRAINT "UQ_2461a300fe1ed769d7a96fa054b"`);
    }

}
