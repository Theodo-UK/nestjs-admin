# Options for AdminEntity

All options are defined on the AdminEntity class:

```typescript
// user.admin.ts
import { AdminEntity } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  // Configuration options go here
}
```

## Supported options

| Option      | Type       | Description                                                | Default Value                                                                                                                                                | Validation                                                                                                    |
| ----------- | ---------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| listDisplay | `String[]` | Defines the fields to be displayed on the changelist page. | By default the list page will display a single column containing the primary key of the entity, or the `toString()` representation of the entity if defined. | Fields listed here must exist on the entity, and must not be `ManyToOne`, `OneToMany` or `ManyToMany` fields. |
