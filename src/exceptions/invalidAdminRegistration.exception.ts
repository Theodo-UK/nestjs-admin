export class InvalidAdminRegistration extends Error {
  constructor(registered) {
    super(
      `Can only register an entity or an AdminEntity. You tried to register ${registered}, idiot.`,
    )
  }
}
