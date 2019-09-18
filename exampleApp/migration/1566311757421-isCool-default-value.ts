import { MigrationInterface, QueryRunner } from 'typeorm'

export class isCoolDefaultValue1566311757421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isCool" SET DEFAULT true`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
