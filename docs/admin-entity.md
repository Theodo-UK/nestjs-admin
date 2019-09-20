## Registering entities on the admin site

There are two ways you can register an entity on the admin site.

#### 1. Registering entities directly

```typescript
// user.module.ts
import { DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'

@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
    ...
  }
}
```

#### 2. Registering entities using the `AdminEntity` class

```typescript
// user.admin.ts
import { AdminEntity, DefaultAdminSite } from 'nestjs-admin'
import { UserAdmin } from './user.admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
}

// user.module.ts
@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserAdmin)
    ...
  }
}
```

## AdminEntity options

All options are defined on the AdminEntity class:

```typescript
// user.admin.ts
import { AdminEntity } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['firstname', 'lastname']
}
```

#### AdminEntity.listDisplay

Set `listDisplay` to control which entity fields are displayed on the list page of the admin, for example:

```typescript
listDisplay = ['firstname', 'lastname']
```

- If you don't set `listDisplay` the list page with show a single column containing the primary key of the entity, or the `toString()` representation of the entity if defined.

- `listDisplay` values cannot refer to `ManyToOne`, `OneToMany` or `ManyToMany` fields.
