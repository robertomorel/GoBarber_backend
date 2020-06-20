import IMailTemplateProvider from '../models/IMailTemplateProvider';
// import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Fake mail content';
  }
}

export default FakeMailTemplateProvider;
