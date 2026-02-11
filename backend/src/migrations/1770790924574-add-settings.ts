import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettings1770790924574 implements MigrationInterface {
    name = 'AddSettings1770790924574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "language" character varying NOT NULL DEFAULT 'English'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailAlerts" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pushAlerts" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "daysBeforeBill" integer NOT NULL DEFAULT '3'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "budgetResetDay" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "budgetCycle" character varying NOT NULL DEFAULT 'monthly'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "budgetCycle"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "budgetResetDay"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "daysBeforeBill"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushAlerts"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailAlerts"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}
