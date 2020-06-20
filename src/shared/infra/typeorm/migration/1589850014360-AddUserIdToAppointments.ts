import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1589850014360
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        /**
         * RETRICT: se existir relacionamento, não permite deletar
         * CASCADE: se alterar o valor, será alterado nos relacionamentos
         * SET NULL: se deletar, o valor do campo que faz relaçao, fica nulo
         */
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentUser');
    await queryRunner.dropColumn('appointments', 'user_id');
  }
}
