export interface AdminAuthenticatorInterface {
  validateCredentials(email: string, pass: string): object | null | Promise<object | null>
}

export type AdminAuthenticatorConstructor = new (...args) => AdminAuthenticatorInterface
