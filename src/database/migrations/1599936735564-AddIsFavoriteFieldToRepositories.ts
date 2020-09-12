import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsFavoriteFieldToRepositories1599936735564
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'repositories',
      new TableColumn({
        name: 'isFavorite',
        type: 'boolean',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('repositories', 'isFavorite');
  }
}
