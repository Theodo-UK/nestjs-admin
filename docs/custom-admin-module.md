---
id: custom-admin-module
title: Create your own admin module
---

`nestjs-admin` provides a `DefaultAdminModule` that allows you to get quickly started. While it provides sensible defaults, there's multiple reasons you might want to use your own admin module:

- Customize how to authenticate into the admin
- Add custom admin endpoint
- Customize the default messages (site name, login prompt)
- Create multiple admin sites
- etc...

## How does the DefaultAdminModule work

To create your own admin module, you need to understand the lower level of the API that the `DefaultAdminModule` uses.

- The `AdminCoreModule` handles all admin CRUD operations. `AdminSite`, `AdminEntity`, `AdminController` are all part of the `AdminCoreModule`. It expects all requests to be authenticated (ie `request.user` to be defined), or throws an error.
- The `AdminAuthModule` provides the authentication. It listens to exceptions from the AdminCoreModule, and redirects to the login page. It provides its own endpoints for authentication. It is generic: it needs configuration to define how to validate admin credentials.
- The `AdminUserModule` is an instance of the `AdminAuthModule`, using an `AdminUser` entity.

The `DefaultAdminModule` is an abstraction over the `AdminCoreModule` and the `AdminUserModule`.

It is possible to create the admin by writing your own abstraction on top of these modules, which allows you to configure them.

## Create your own AdminModule

To start with, let's recreate the `DefaultAdminModule`, but in your own application using the lower-level modules above. For clarity, let's call it `BackofficeModule`.

```ts
// backoffice.module.ts
import { AdminCoreModuleFactory, AdminUserModule } from 'nestjs-admin'

const coreModule = AdminCoreModuleFactory.createAdminCoreModule({})
const authModule = AdminUserModule

@Module({
  imports: [coreModule, authModule],
  exports: [coreModule, authModule],
})
class BackofficeModule {}
```

Now, you can import the `BackofficeModule` in your `AppModule` instead of the `DefaultAdminModule`!

## Custom AdminSite

The admin site is responsible for most of the work, like fetching/creating/deleting entities. To add custom behavior, you'll want to declare your own:

```ts
import { Injectable } from '@nestjs/common'
import { DefaultAdminSite } from 'nestjs-admin'

@Injectable()
export class AdminSite extends DefaultAdminSite {
  // Overwrite or add methods here
}
```

Then give this `AdminSite` to the `AdminCoreModuleFactory.createAdminCoreModule` in your `BackofficeModule`, and update your `BackofficeModule`:

```ts
const coreModule = AdminCoreModuleFactory.createAdminCoreModule({
  adminSite: AdminSite,
})

export class BackofficeModule {
  constructor(private readonly adminSite: CustomAdminSite) {
    adminSite.register(...)
  }
}
```

## Custom AdminController

The admin controller handles the HTTP layer, before delegating the actual work to the admin site. To hook in routes, change requests/responses, add routes and pages, you'll want to declare your own:

```ts
import { Inject } from '@nestjs/common'
import { DefaultAdminController } from 'nestjs-admin'

export class AdminController extends DefaultAdminController {
  // Overwrite or add methods here
}
```

Then give this `AdminController` to the `AdminCoreModuleFactory.createAdminCoreModule` in your `BackofficeModule`.
