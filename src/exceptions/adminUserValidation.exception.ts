export class AdminUserValidationException extends Error {
  constructor() {
    super(`Email address and password must be entered.`)
  }
}
