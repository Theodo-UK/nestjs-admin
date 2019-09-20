## AdminEntity class

You can register entities with options using the `AdminEntity` class

The simpliest example of registering an `AdminEntity` class to for a `User` entity looks like this:

```typescript
// user.admin.ts
import { AdminEntity, DefaultAdminSite } from 'nestjs-admin'
import { UserAdmin } from './user.admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
}

@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserAdmin)
    ...
  }
}

```

This will behave the same as:

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

- If you don't set `listDisplay` the list page with show a single column containing the `toString()` representation of the entity.

- `listDisplay` values cannot refer to `ManyToOne` or `ManyToMany` fields entity fields
