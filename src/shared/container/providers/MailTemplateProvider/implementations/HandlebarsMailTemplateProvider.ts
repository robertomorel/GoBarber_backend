import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    // -- "handlebars.compile" retorna uma função preparada para receber os parâmetros
    // -- a serem adicionados no HTML
    /**
     * Exemplo:
      templateData: {
        template: 'Olá, {{name}}: {{token}}',
        variables: {
          name: user.name,
          token,
        },
      },
     */
    const parseTemplate = handlebars.compile(templateFileContent);
    // -- Resolve as variávei do HTML
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
