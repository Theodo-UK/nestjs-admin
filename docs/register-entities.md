---
id: register-entities
title: Registering entities in the admin site
sidebar_label: Register entities
---

## Registering entities on the admin site

There are two ways you can display an entity on the admin site using `adminSite.register`:

- Register the entity class directly
- Declare an AdminEntity for this entity class and register this. This allows configuration of the admin interface for this entity

In all cases, the first argument to `adminSite.register` is the name of the admin section the entities will be shown under.

## Registering entities directly

Registering an entity directly will use the default configuration options, and is good enough for most cases.

```typescript
// user.module.ts
import { DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'
import { Group } from './group.entity'

@Module({ /* ... */ })
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
    adminSite.register('User', Group)
    ...
  }
}
```

## Registering entities using the `AdminEntity` class

> All configuration options of the AdminEntity can be [found here](admin-entity)

If you want to customize how the admin interface looks like and interacts for an entity class, you will need to extend the `AdminEntity` class.

> The only required property is `entity`, which needs to be [typeorm entity](https://github.com/typeorm/typeorm/blob/master/docs/entities.md) class.

Let's see how to configure the admin for an entity. First, let's create an AdminEntity for a `User` entity. It is good practice to create a `<entityname>.admin.ts` file, so let's do this:

```typescript
// user.admin.ts
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
}
```

Now, we'll register this AdminEntity in the admin site:

```typescript
// user.module.ts
import { DefaultAdminSite, DefaultAdminSite } from 'nestjs-admin'
import { UserAdmin } from './user.admin'

@Module({
  imports: [DefaultAdminModule],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserAdmin)
  }
}
```

Et voilà! If you go to the admin interface (`/admin`), you'll see an entry for the User entity.

This `UserEntity` isn't very useful yet: with any configuration, it does the same thing as registering the entity class directly. Let's add some configuration.

By default, the list view (`/admin/user/user`) only displays the primary key or the `toString()` of each entity. Let's add some configuration to display more useful information: the first name and last name of each entity instance:

```typescript
// user.admin.ts
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName']
}
```

> Each of the values of `listDisplay` has to be a valid property of the User entity.

Going back to the User list admin interface, you can now see that the list of users is now a table with 3 columns: the id, the first name and the last name.

It is a lot more readable, but we can do better! If you have any non-trivial amount of data, you won't be happy manually looking for a specific user. You'll want to be able to search by name directly, so let's set this up:

```typescript
// user.admin.ts
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName']
  searchFields = ['firstName', 'lastName']
}
```

> Like `listDisplay`, each of the values of `searchFields` has to be a valid property of the User entity.

> **Note:** the search is case-sensitive

Here you go, in a few minutes you now have a detailled searchable list of all the users in your database!
