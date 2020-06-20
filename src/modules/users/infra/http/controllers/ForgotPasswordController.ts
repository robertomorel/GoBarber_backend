/**
 * Metodologia Restfull
 * Deve ter no máximo 5 métodos: index, show, create, update, delete
 */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    // const usersRepository = new UsersRepository();
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json(); // -- Resposta com sucesso, mas sem conteúdo
  }
}
