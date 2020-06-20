import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProviderService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const cacheKey = `providers-list:${user_id}`;
    // -- Usando Generics para garantir que o retorno do recover será do tipo User[]
    let users = await this.cacheProvider.recover<User[]>(cacheKey);

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      console.log('Opa!! A query no banco foi feita...');

      await this.cacheProvider.save(cacheKey, classToClass(users));
    }

    return users;
  }
}
