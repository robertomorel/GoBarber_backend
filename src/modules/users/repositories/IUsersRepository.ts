/**
 * Interface criada para padronizar os métodos principais de controle dos
 * Users, independente da tecnologia usada de infra.
 * Por exemplo, hoje usamos typeorm. Os scripts "services" são totalmente dependentes disso.
 * Caso mudemos esta tecnologia, podemos perder tudo o que tá lá.
 *
 * Deste modo é necessário criar uma Interface para criar regras para definir quais
 * métodos (om seus retornos) o repositório terá.
 *
 * Atende à um critério do SOLID chamado 'Liskov Substitution Principle'
 *   Princípio da programação que indica que camadas que fazem integrações com
 *   outras bibliotecas (como DB) podem ser substituíveis, definindo um conjunto
 *   de regras. Esta interface é para atender à este princípio.
 *
 * Como sabemos quais métodos estarão na interface?
 * Basta olhar o que é usado nos services.
 */
import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
