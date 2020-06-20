/**
 * Metodologia Restfull
 * Deve ter no máximo 5 métodos: index, show, create, update, delete
 */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    // const usersRepository = new UsersRepository();
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      password,
      token,
    });

    return response.status(204).json(); // -- Resposta com sucesso, mas sem conteúdo
  }
}
