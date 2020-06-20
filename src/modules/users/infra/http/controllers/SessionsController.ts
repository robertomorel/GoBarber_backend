/**
 * Metodologia Restfull
 * Deve ter no máximo 5 métodos: index, show, create, update, delete
 */
import { Request, Response } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // const usersRepository = new UsersRepository();
    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // delete user.password;

    /**
     * "classToClass(user)" -> faz com que as modificações feitas na entidade user
     * com os elementos @Expose() e @Exclude() sejam aplicados
     */
    return response.json({ user: classToClass(user), token });
  }
}
