import {MigrationInterface, QueryRunner} from "typeorm";

export class userGroupManytomany1565439232885 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_groups_groups" ("usersId" integer NOT NULL, "groupsId" integer NOT NULL, CONSTRAINT "PK_1cf09013aa7a345778eaeb5a421" PRIMARY KEY ("usersId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b46034fbd69664807cb4afb16" ON "users_groups_groups" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_270e39efd76d142903fd6ed528" ON "users_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" ADD CONSTRAINT "FK_1b46034fbd69664807cb4afb16f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" ADD CONSTRAINT "FK_270e39efd76d142903fd6ed528f" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users_groups_groups" DROP CONSTRAINT "FK_270e39efd76d142903fd6ed528f"`);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" DROP CONSTRAINT "FK_1b46034fbd69664807cb4afb16f"`);
        await queryRunner.query(`DROP INDEX "IDX_270e39efd76d142903fd6ed528"`);
        await queryRunner.query(`DROP INDEX "IDX_1b46034fbd69664807cb4afb16"`);
        await queryRunner.query(`DROP TABLE "users_groups_groups"`);
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
