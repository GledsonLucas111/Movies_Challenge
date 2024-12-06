import { MigrationInterface, QueryRunner } from 'typeorm';

export class NextMigration1733483869705 implements MigrationInterface {
  name = 'NextMigration1733483869705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservation" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "movieId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2024-12-06T11:17:49.907Z"', "notified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rentals" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "movieId" bigint NOT NULL, "rentalDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP, "isReturned" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" bigint NOT NULL, "title" character varying NOT NULL, "overview" text NOT NULL, "vote_average" character varying NOT NULL, "poster_path" character varying NOT NULL, "release_date" TIMESTAMP NOT NULL, "isRented" boolean NOT NULL DEFAULT false, "state_conservation" character varying NOT NULL, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_cd3bd069ee6ea5e1ae79e0f4993" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rentals" ADD CONSTRAINT "FK_ffe1d7b0b585885667954522513" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rentals" ADD CONSTRAINT "FK_f62e553494249837d406ad4d5d8" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rentals" DROP CONSTRAINT "FK_f62e553494249837d406ad4d5d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rentals" DROP CONSTRAINT "FK_ffe1d7b0b585885667954522513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_cd3bd069ee6ea5e1ae79e0f4993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`,
    );
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "rentals"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "reservation"`);
  }
}
