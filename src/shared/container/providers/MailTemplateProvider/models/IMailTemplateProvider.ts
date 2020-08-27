import IParseMailTemplateDTP from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTP): Promise<string>;
}
