/**
 * Metodologia Restfull
 * Deve ter no máximo 5 métodos: index, show, create, update, delete
 */
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    // const usersRepository = new UsersRepository();

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    // delete user.password;
    /**
     * "classToClass(user)" -> faz com que as modificações feitas na entidade user
     * com os elementos @Expose() e @Exclude() sejam aplicados
     */
    return response.json(classToClass(user));
  }
}
