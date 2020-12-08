export class DuplicateUsernameException extends Error {
  constructor(username: string) {
    super(`There is already an AdminUser with this username: ${username}`);
  }
}
