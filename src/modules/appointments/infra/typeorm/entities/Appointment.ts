// import { uuid } from 'uuidv4';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
/**
 * O Decorator funciona como se fosse uma função.
 * Quando colocamos o Decorator em cima da classe, ela se torna um parâmetro para o Entiry.
 * Isso só funciona usando o Typescript
 * Este @Entity indita que o Model, quando saldo, será sempre gravado na tabela 'appointments'
 * Porém, precisamos dizer para o código quais dos campos da classe representam colunas na tabela
 */
@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  /**
   * É usada essa estratégia para eu ter acesso ao
   * Usuário relacionado, e não apenas seu ID
   */
  // -- Tipo de relacionamento Muito para Um. Muitos agendamentos para Um Usuário
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  /**
   * { eager: true } -> automaticamente, quando eu trouxer os dados de um appointment,
   *                    também virão os dados de um usuário.
   *                    O parâmetro que essa entidade usa é o user_id.
   * { lazy: true } -> automaticamente, quando eu der um "await appointment.user", tenho
   *                   todas as informações do usuário.
   *                   Exe.: const user = await appointment.user;
   */
  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Omit: função helpers do typescript
   * Omit<param1, param2> -> param1 = tipo da variável (schema do objeto); param2 = exceção
   */
  // -- Com o Decorator, o constructor fica desnecessário.
  /*
  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
  */
}

export default Appointment;
