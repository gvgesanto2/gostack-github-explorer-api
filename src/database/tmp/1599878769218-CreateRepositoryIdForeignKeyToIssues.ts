import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateRepositoryIdForeignKeyToIssues1599878769218
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'issues',
      new TableForeignKey({
        name: 'repositoryIssue',
        columnNames: ['repository_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'repositories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('issues', 'repositoryIssue');
  }
}
