import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactions1771089287975 implements MigrationInterface {
    name = 'AddTransactions1771089287975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(12,2) NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "description" character varying NOT NULL, "category" character varying, "date" date NOT NULL, "notes" character varying, "userId" uuid NOT NULL, "subscriptionId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_68b3182f3f5d4d5a0f41c12139" ON "transactions" ("subscriptionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_68b3182f3f5d4d5a0f41c12139b" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_68b3182f3f5d4d5a0f41c12139b"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbdba4e2ac694cf8c9cecf4dc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68b3182f3f5d4d5a0f41c12139"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bb58f2b6e30cb51a6504599f4"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
