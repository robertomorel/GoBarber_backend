/**
 * Este template será usado para gerar um HTML onde podemos manipular e incluir
 * variáveis
 */

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
