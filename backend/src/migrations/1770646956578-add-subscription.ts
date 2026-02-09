import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscription1770646956578 implements MigrationInterface {
    name = 'AddSubscription1770646956578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_currency_enum" AS ENUM('USD', 'EUR', 'INR', 'GBP')`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_frequency_enum" AS ENUM('MONTHLY', 'YEARLY', 'WEEKLY')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" "public"."subscriptions_currency_enum" NOT NULL DEFAULT 'INR', "frequency" "public"."subscriptions_frequency_enum" NOT NULL DEFAULT 'MONTHLY', "category" character varying, "startDate" date NOT NULL, "nextBillingDate" date NOT NULL, "websiteUrl" character varying, "isTrial" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_currency_enum"`);
    }

}
