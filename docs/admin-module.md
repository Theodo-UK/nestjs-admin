# Instantiating the AdminModule

The AdminModule is an instance of an administration interface. `nestjs-admin` exposes a `CoreAdminModule`, but you can create your own if you need customizability thanks to the `CoreAdminModuleFactory`.

## Create your own AdminModule

Here's how to make your own AdminModule:

```ts
// src/admin/admin.module.ts
import { Module } from '@nestjs/common'
import { CoreAdminModuleFactory } from 'nestjs-admin'

export const AdminModule = CoreAdminModuleFactory({
  adminSite: ..., // your own service for custom behavior
  adminController: ..., // your own controller to plug in the routes or add your own
  adminEnvironment: ..., // your own Nunjucks environment, if you need to configure the templating layer
})
```

Need to inject your own providers into your custom site, controller or environment? You can:

```ts
// src/admin/admin.module.ts
import { Module } from '@nestjs/common'
import { CoreAdminModuleFactory } from 'nestjs-admin'

const AdminModuleInstance = CoreAdminModuleFactory({
  /* ... */
})

@Module({
  imports: [AdminModuleInstance /* you can import whatever here */],
  providers: [
    /* your own providers */
  ],
  controller: [
    /* your own controllers */
  ],
  exports: [AdminModuleInstance /* you can export whatever here */],
})
export class AdminModule {}
```

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

Then give this `AdminSite` to the `CoreAdminModuleFactory.createAdminModule`.

## Custom AdminController

The admin controller handles the HTTP layer, before delegating the actual work to the admin site. To hook in routes, change requests/responses, add routes and pages, you'll want to declare your own:

```ts
import { Inject } from '@nestjs/common'
import { DefaultAdminController } from 'nestjs-admin'

export class AdminController extends DefaultAdminController {
  // Overwrite or add methods here
}
```

Then give this `AdminController` to the `CoreAdminModuleFactory.createAdminModule`.
