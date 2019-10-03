export interface AdminAuthenticatorInterface {
  validateAdminCredentials(
    username: string,
    password: string,
  ): object | null | Promise<object | null>
}

export type AdminAuthenticatorConstructor = new (...args) => AdminAuthenticatorInterface
