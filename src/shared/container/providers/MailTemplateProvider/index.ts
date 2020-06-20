/**
 * SEMPRE QUE FAZEMOS INTEGRAÇÃO COM BLIOTECAS EXTERNAS, COM SERVIÇOS QUE PODEM MUDAR
 * COM O TEMPO, PRECISAMOS CRIAR ESTES PROVIDERS PARA NÃO HAVER MAIORES IMPACTOS
 * NA APLICAÇÃO. DESTE MODO, NÓS ISOLAMOS AS FUNCIONALIDADES DIRETAMENTE INTEGRADAS
 * COM ESTES SERVIÇOS.
 */
import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
