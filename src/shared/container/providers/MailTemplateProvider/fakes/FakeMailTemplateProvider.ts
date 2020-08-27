import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakemailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'template';
  }
}

export default FakemailTemplateProvider;
