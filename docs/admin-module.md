# Instantiating the AdminModule

The AdminModule is an instance of an administration interface. `nestjs-admin` exposes a `DefaultAdminModule` providing generic functionality, but you will need to instantiate your own, at the very least to be able to add [authentication](./authentication.md) to your administration interface. You will also be able to extend the AdminController (to add your own custom routes) or the AdminSite (to customize behaviors of the administration interface).

## Instantiate your own AdminModule

Here's the minimum setup to make your own AdminModule:

```ts
// src/admin/admin.module.ts
import { Module } from '@nestjs/common'
import { DefaultAdminModule } from 'nestjs-admin'

@Module({
  imports: [DefaultAdminModule],
  exports: [DefaultAdminModule],
})
export class AdminModule {}
```

```ts
// src/app.module.ts
import { Module } from '@nestjs/common'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [/* ... */, AdminModule],
  /* ... */,
})
export class AppModule {}
```

With this in place, you can start registering entities to manage them in the administration interface.

## Set up authentication

The admin interface is not accessible until you've configure how to authenticate to it, [see here](./authentication)

## Register entities in the admin site

```ts
// user.module.ts
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { DefaultAdminSite } from 'nestjs-admin'
import { AdminModule } from 'src/admin' // your admin module
import { User } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminModule],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('User', User)
  }
}
```

You can now manage these entities at `/admin`!
