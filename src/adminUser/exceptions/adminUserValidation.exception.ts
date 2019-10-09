export class AdminUserValidationException extends Error {
  constructor() {
    super(`Username and password are required.`)
  }
}
