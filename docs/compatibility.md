# Compatibility

- TypeORM must be version `0.2.12` or higher, otherwise it can cause a `DuplicateKeyException` if foreign keys have the same name as the entity they reference.
