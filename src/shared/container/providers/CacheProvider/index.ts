import { container } from 'tsyringe';
import RedisCacheProvider from './implementations/RedisCacheProvider';
import ICacheProvider from './models/ICacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

/**
 * O "registerSingleton" não roda o constructor de uma classe.
 * Aqui, precisamos usar o "registerSingleton" para que o node crie uma instância
 * da classe EtherealMailProvider, deste modo, rodar o construtor usado.
 * Para o NODE, a criação de uma instância já é um singleton
 */
container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
