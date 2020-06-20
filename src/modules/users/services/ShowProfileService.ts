import AppError from '@shared/erros/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}
