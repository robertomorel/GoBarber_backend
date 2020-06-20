/**
 * - Repositório para os agendamentos -
 * Detentor das operações que serão feitas em cima dos dados dos agendamentos (criar, ler, editar, deletar)
 * Tira as responsabilidades das rotas.
 * Este repositório faz a conexão entre a "persistência dos dados" e as "rotas"
 * Persistência <-> Repositório <-> Rota
 */
// import { isEqual } from 'date-fns';
import { Repository, getRepository, Not } from 'typeorm';
// -- Interface para ser extendida neste repositório
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

/**
 * Sempre que uma função no typescript for assíncrona, o seu retorno não é uma variável
 * ou objeto comum, mas uma Promise, cujo parâmetro é aquela variável ou objeto
 * Exemplo: "Promise<Appointment | null>"
 */

/**
 * Este arquivo só está sendo necessário pelo uso do método customizado 'findByDate'.
 * Se ele não existisse, poderíamos usar os métodos padrão do Repository e este script
 * não seria necessário
 */
// @EntityRepository(Appointment) -> foi jogado para a interface
/* class AppointmentsRepository extends Repository<Appointment> */
class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
