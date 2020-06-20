// import { uuid } from 'uuidv4';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

/**
 * O Decorator funciona como se fosse uma função.
 * Quando colocamos o Decorator em cima da classe, ela se torna um parâmetro para o Entiry.
 * Isso só funciona usando o Typescript
 * Este @Entity indita que o Model, quando saldo, será sempre gravado na tabela 'appointments'
 * Porém, precisamos dizer para o código quais dos campos da classe representam colunas na tabela
 */
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude() // -- Para que o campo não exista quando for para o frontend
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Para expor um campo que não existe diretamente na classe.
   * O campo e o valor são criados em tempo de execução
   */
  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
