import UsersTokens from '../infra/typeorm/entities/UsersTokens';

export default interface IUsersTokensRepository {
  generate(user_id: string): Promise<UsersTokens>;
  findByToken(tonken: string): Promise<UsersTokens | undefined>;
}
