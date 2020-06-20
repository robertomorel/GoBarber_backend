import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    /*
    console.log(this.users);
    console.log(id);
    console.log(`Retorno: ${this.users.find(user => user.id === id)?.id}`);
    */
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[index] = user;
    return user;
  }
}

export default FakeUsersRepository;
