---
id: admin-entity
title: The Admin Entity
sidebar_label: Admin Enitities
---

## Registering entities on the admin site

There are two ways you can display an entity on the admin site using `DefaultAdminSite.register`.

In both cases, the first parameter defines the name of the section on the admin site where the entity is registered.

## Registering entities directly

Registering an entity directly will use the default [configuration options](#adminentity-options), and is good enough for most cases.

```typescript
// user.module.ts
import { DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'
import { Group } from './group.entity'

@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
    adminSite.register('User', Group)
    ...
  }
}
```

## Registering entities using the `AdminEntity` class

If you want to add some [configuration options](#adminentity-options), you will need to extend the `AdminEntity` class.

The only required property is `entity` which needs to be [typeorm entity](https://github.com/typeorm/typeorm/blob/master/docs/entities.md) class.

```typescript
// user.admin.ts
import { AdminEntity, DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'
import { Group } from './group.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  // Configuration options go here
}

// user.module.ts
@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserAdmin)
    adminSite.register('User', Group)
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

### AdminEntity.listDisplay

Configures which fields of the entity will be displayed on the list page.

```typescript
listDisplay = ['id', 'firstname', 'lastname', 'email']
```

![image](assets/AdminEntity.listDisplay.png)

- If you don't set `listDisplay`, the list page will display a single column containing the primary key of the entity, or the `toString()` representation of the entity if defined.

- `listDisplay` values cannot refer to `ManyToOne`, `OneToMany` or `ManyToMany` fields.
