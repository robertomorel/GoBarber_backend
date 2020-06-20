import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/erros/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  /**
   * Validação do Token JWT
   */

  // -- Validando existência do authorization no cabeçalho ---------------------
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing!', 401);
  }

  const { secret } = auth.jwt;

  // -- Validando formatação do token ------------------------------------------
  // const [type, token] = authHeader.split(' ');
  const [, token] = authHeader.split(' ');

  // -- O verify verifica se o token é válido ou não
  try {
    // -- Dá um throw caso o token não seja válido
    const decoded = verify(token, secret);

    // -- Forçando o tipo da variável 'decoded' com a interface TokenPayload
    const { sub } = decoded as ITokenPayload;

    /**
     * Para que o typescript não gere erro ao tentar acessar uma variável user, dentro do
     * Request (pois originalmente não existe, sobrescrevemos a Interface do Request
     * no arquivo '@types/express.d.ts'
     */
    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 403);
  }
}
