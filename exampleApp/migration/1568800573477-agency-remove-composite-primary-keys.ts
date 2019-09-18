import {MigrationInterface, QueryRunner} from "typeorm";

export class agencyRemoveCompositePrimaryKeys1568800573477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9f1a1151df92f65f65df6b44aaa"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "agencyCountry"`);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_6baa047e99a8636d879f6747c54"`);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "agencies" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_184debc49e72b43579476cc6e75" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_184debc49e72b43579476cc6e75"`);
        await queryRunner.query(`ALTER TABLE "agencies" ADD "country" character varying NOT NULL DEFAULT 'UK'`);
        await queryRunner.query(`ALTER TABLE "agencies" DROP CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28"`);
        await queryRunner.query(`ALTER TABLE "agencies" ADD CONSTRAINT "PK_6baa047e99a8636d879f6747c54" PRIMARY KEY ("id", "country")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "agencyCountry" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9f1a1151df92f65f65df6b44aaa" FOREIGN KEY ("agencyId", "agencyCountry") REFERENCES "agencies"("id","country") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
