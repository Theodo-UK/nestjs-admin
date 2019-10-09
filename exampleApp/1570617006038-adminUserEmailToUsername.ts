import {MigrationInterface, QueryRunner} from "typeorm";

export class adminUserEmailToUsername1570617006038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_74d401fbaed54d70448510f9b50"`, undefined);
        await queryRunner.query(`ALTER TABLE "adminUser" RENAME COLUMN "email" TO "username"`, undefined);
        await queryRunner.query(`ALTER TABLE "adminUser" RENAME CONSTRAINT "UQ_2461a300fe1ed769d7a96fa054b" TO "UQ_58bd2b086488ba1ba90847a192e"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "agencyName" TO "deathtime"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" TIME`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_03d739b1b2b8499cd4932b42ade"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_184debc49e72b43579476cc6e75" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_184debc49e72b43579476cc6e75"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_03d739b1b2b8499cd4932b42ade" PRIMARY KEY ("id", "name")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deathtime"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "deathtime" character varying(50)`, undefined);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deathtime" TO "agencyName"`, undefined);
        await queryRunner.query(`ALTER TABLE "adminUser" RENAME CONSTRAINT "UQ_58bd2b086488ba1ba90847a192e" TO "UQ_2461a300fe1ed769d7a96fa054b"`, undefined);
        await queryRunner.query(`ALTER TABLE "adminUser" RENAME COLUMN "username" TO "email"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_74d401fbaed54d70448510f9b50" FOREIGN KEY ("agencyId", "agencyName") REFERENCES "agencies"("id","name") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
