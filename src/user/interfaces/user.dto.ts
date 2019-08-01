export class UserDto {
  readonly name: string
  readonly email: string
  readonly password: string
  readonly roles: string[]
  readonly agency: object | null
}
