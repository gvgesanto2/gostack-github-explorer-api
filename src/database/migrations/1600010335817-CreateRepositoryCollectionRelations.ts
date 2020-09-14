import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateRepositoryCollectionRelations1600010335817
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'repository_collection_relations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'repository_id',
            type: 'int',
          },
          {
            name: 'collection_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'repository_collection_relations',
      new TableForeignKey({
        name: 'repositoryFk',
        columnNames: ['repository_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'repositories',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'repository_collection_relations',
      new TableForeignKey({
        name: 'collectionFk',
        columnNames: ['collection_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'collections',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'repository_collection_relations',
      'collectionFk',
    );
    await queryRunner.dropForeignKey(
      'repository_collection_relations',
      'repositoryFk',
    );
    await queryRunner.dropTable('repository_collection_relations');
  }
}
