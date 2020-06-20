import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailProvider from './models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

/**
 * O "registerSingleton" não roda o constructor de uma classe.
 * Aqui, precisamos usar o "registerSingleton" para que o node crie uma instância
 * da classe EtherealMailProvider, deste modo, rodar o construtor usado.
 * Para o NODE, a criação de uma instância já é um singleton
 */
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
