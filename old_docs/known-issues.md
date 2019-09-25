# Known issues

- `DuplicateKeyException`: With TypeORM version older than `0.2.12`, foreign keys cannot have the same name as the entity they reference. If they do then this causes a `DuplicateKeyException`. If you have this issue please update TypeORM or rename your foreign keys.
