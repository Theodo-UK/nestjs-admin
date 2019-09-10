import {MigrationInterface, QueryRunner} from "typeorm";

export class userDeathDateTypeFix1566466897538 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" TIME`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" TIME WITH TIME ZONE`);
    }

}
