/**
 * Ethereal: https://ethereal.email
 *   yarn add nodemailer
 *
 * Provider para envio teste de emails com o Ethereal
 */
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  /**
   * Por existir uma dependência muito grande entre o MailProvider e TemplateMailPrpovider,
   * no lugar de fazer a injeção de dependência do TemplateMailProvider no
   * SendForgotPasswordEmailService.ts, podemos fazer diretamente aqui.
   * Ou seja, um provider fazendo injeção de dependências em outro.
   *
   * Logo, podemos agora trabalhar com os templates neste provider.
   */
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      // console.log(account);

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    try {
      const message = await this.client.sendMail({
        from: {
          name: from?.name || 'Equipe Gobarber',
          address: from?.email || 'equipe@gobarber.com.br',
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    } catch (err) {
      console.log(`Falha inesperada no envio do email. Erro: ${err}`);
    }
  }
}

export default EtherealMailProvider;
