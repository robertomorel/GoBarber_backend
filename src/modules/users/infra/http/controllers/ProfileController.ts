import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { container } from 'tsyringe';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    // delete user.password;
    /**
     * "classToClass(user)" -> faz com que as modificações feitas na entidade user
     * com os elementos @Expose() e @Exclude() sejam aplicados
     */
    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { name, email, old_password, password } = request.body;

    // const usersRepository = new UsersRepository();
    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
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
