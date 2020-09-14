import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCollectionsIdsFieldToRepositories1599949138756
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'repositories',
      new TableColumn({
        name: 'collections_ids',
        type: 'uuid',
        isArray: true,
      }),
    );

    await queryRunner.createForeignKey(
      'repositories',
      new TableForeignKey({
        name: 'collectionsIds',
        columnNames: ['collections_ids'],
        referencedColumnNames: ['id'],
        referencedTableName: 'collections',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('repositories', 'collectionsIds');
    await queryRunner.dropColumn('repositories', 'isFavorite');
  }
}
