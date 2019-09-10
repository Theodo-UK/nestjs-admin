export class DuplicateEmailException extends Error {
  constructor(email: string) {
    super(`There is already an AdminUser with this email: ${email}`)
  }
}
