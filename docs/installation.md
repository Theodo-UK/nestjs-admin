---
id: install
title: Installation
---

Let's get you started with a minimal setup.

## Installing nestjs-admin

Add nestjs-admin to your dependencies:

```bash
yarn add nestjs-admin # With yarn
npm install nestjs-admin # With NPM
```

## Updating Nest config

Then add the provided `DefaultAdminModule` to your app modules:

```ts
// src/app.module.ts
import { Module } from '@nestjs/common'
import { DefaultAdminModule } from 'nestjs-admin'

@Module({
  imports: [TypeOrmModule.forRoot(), /* ... */, DefaultAdminModule],
  /* ... */,
})
export class AppModule {
  /* ... */
}
```

Add the provided `AdminUser` to your orm config:

The DefaultAdminModule exposes an AdminUser entity, which has credentials that allow you to login to the admin interface.

> There's no easy option to use your own user entity for now. If you have this requirement, open an issue so that we can help you.

```ts
// If you use an ormconfig.js
const AdminUser = require('nestjs-admin').AdminUserEntity
module.exports = {
  /* ... */,
  entities: [/* ... */, AdminUser],
  // Alternatively:
  // entities: [/* ... */, 'node_modules/nestjs-admin/**/*.entity.js'],
}
```

```bash
# If you use environment variables
TYPEORM_ENTITIES=your_existing_paths,node_modules/nestjs-admin/**/*.entity.js
```

## Using the admin

Create a first AdminUser to log in with:

```bash
# Create the AdminUser schema in database
npx ts-node node_modules/.bin/typeorm migration:generate -n "create-admin-user"
npx ts-node node_modules/.bin/typeorm migration:run

# Now you can create an AdminUser through the CLI
npx nestjs-admin createAdminUser
```

> You can create AdminUsers from the `nestjs-admin createAdminUser` CLI, or directly from the administration interface!

You can now login to access the admin interface at `/admin/login`!

Register entities in the admin site:

```ts
// user.module.ts
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), DefaultAdminModule],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('User', User)
  }
}
```
