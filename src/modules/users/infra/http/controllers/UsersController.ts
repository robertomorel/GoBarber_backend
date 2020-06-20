/**
 * Metodologia Restfull
 * Deve ter no máximo 5 métodos: index, show, create, update, delete
 */
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/users/services/CreateUserService';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    // const usersRepository = new UsersRepository();
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // delete user.password;
    /**
     * "classToClass(user)" -> faz com que as modificações feitas na entidade user
     * com os elementos @Expose() e @Exclude() sejam aplicados
     */
    return response.json(classToClass(user));
  }
}
