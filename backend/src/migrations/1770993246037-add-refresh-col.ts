import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshCol1770993246037 implements MigrationInterface {
    name = 'AddRefreshCol1770993246037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshTokenHash" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshTokenHash"`);
    }

}
