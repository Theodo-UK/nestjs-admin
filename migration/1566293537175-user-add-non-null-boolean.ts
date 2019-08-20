import {MigrationInterface, QueryRunner} from "typeorm";

export class userAddNonNullBoolean1566293537175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isCool" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isCool"`);
    }

}
