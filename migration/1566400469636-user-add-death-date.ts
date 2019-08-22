import {MigrationInterface, QueryRunner} from "typeorm";

export class userAddDeathDate1566400469636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" TIME WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isCool" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isCool" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`);
    }

}
