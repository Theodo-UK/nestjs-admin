import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUserDeathtime1570036049155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" TIME`, undefined);
    }

}
