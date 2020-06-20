/**
 * Este middleware faz com que cada ip só consiga fazer 5 requisições por segundo.
 * Mais do que isso, dará erro no cliente.
 * Isso pode evitar ataques Brute Force
 */

import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/erros/AppError';

// -- Faz uma conexão com o Redis, criando um client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

// -- Cria uma taxa delimitadora de acesso
const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient, // -- Client da requisição
  keyPrefix: 'rateLimit',
  points: 5, // -- Quantas requisições dentro de X durações por IP
  duration: 1, // -- Dentro de 1s
  // blockDuration: 5, // -- Tempo que deixa o usuário bloqueado após atingir um número máximo de req.
});

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // -- Passa por parâmetro o ip do usuário...
    // console.log(req.ip);
    await rateLimiterRedis.consume(req.ip);
    return next();
  } catch {
    // throw new AppError(err);
    throw new AppError('Too many requests', 429);
  }
}
