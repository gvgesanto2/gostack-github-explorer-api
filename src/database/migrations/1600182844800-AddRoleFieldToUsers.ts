import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRoleFieldToUsers1600182844800
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: ['user', 'admin'],
        enumName: 'roleEnum',
        default: `'user'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role');
  }
}
