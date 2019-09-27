import {MigrationInterface, QueryRunner} from "typeorm";

export class AgencyCompositePK1569597180334 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_184debc49e72b43579476cc6e75"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "agencyName" character varying(50)`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_03d739b1b2b8499cd4932b42ade" PRIMARY KEY ("id", "name")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_74d401fbaed54d70448510f9b50" FOREIGN KEY ("agencyId", "agencyName") REFERENCES "agencies"("id","name") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_74d401fbaed54d70448510f9b50"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_03d739b1b2b8499cd4932b42ade"`, undefined);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "agencyName"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_184debc49e72b43579476cc6e75" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
