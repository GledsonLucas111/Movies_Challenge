import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1733257173852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``);
  }
}
