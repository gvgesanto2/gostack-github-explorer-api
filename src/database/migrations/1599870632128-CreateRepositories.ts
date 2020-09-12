import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRepositories1599870632128
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'repositories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'owner',
            type: 'json',
          },
          {
            name: 'watchers_count',
            type: 'int',
          },
          {
            name: 'stargazers_count',
            type: 'int',
          },
          {
            name: 'forks_count',
            type: 'int',
          },
          {
            name: 'open_issues_count',
            type: 'int',
          },
          {
            name: 'issues',
            type: 'json',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('repositories');
  }
}
