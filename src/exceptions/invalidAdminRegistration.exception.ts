export class InvalidAdminRegistration extends Error {
  constructor(registered) {
    super(
      `Cannot register ${registered} in the admin site. You can only register TypeORM entities or subclasses of AdminEntity.`,
    )
  }
}
