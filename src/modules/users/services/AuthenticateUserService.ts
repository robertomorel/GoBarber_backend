// import { getRepository } from 'typeorm';
// import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/erros/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination!', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination!', 401);
    }

    // -- Não precisa do await por ser um método síncrono (não retorna uma Promise)
    /**
     * 1º params: Payload - tudo o que colocamos no token, porém, não seguro.
     *      Geralmente coisas que serão usados no frontend
     * 2º params: Chave secreta (Secret) - Só a aplicação conhece
     *      http://www.md5.cz/ -> gerar um MD5 por esse site
     * 3º params: Configurações
     *     subject: usuário que gerou o token
     *     expiresIn: tempo de expiração
     */
    const { secret, expiresIn } = auth.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    /**
     * Para analisar o resultado do token:
     *     jwt.io -> site
     */

    return { user, token };
  }
}

export default AuthenticateUserService;
