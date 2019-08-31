# Authentication

All the pages of the admin interface are expecting an authenticated user. NestJS does not have a built-in concept of user, this means that it is up to you to provide this authentication. However, `nestjs-admin` gives you the tools to do this easily.

> If you want more details, there is an [ADR about authentication](./adr/01-admin-authentication.md)

## Using the provided DefaultAdminAuthModule

`nestjs-admin` exposes a `DefaultAdminAuthModule`. By importing this module, you import these functionalities:

- An AdminUser entity (with an `email` and `password`)
- A login page checking AdminUser credentials and logging you in, allowing access to the admin interface

### Import the DefaultAdminAuthModule

You just need to import the `DefaultAdminAuthModule` in your application:

```ts
// src/app.module.ts
import { Module } from '@nestjs/common'
import { DefaultAdminModule, DefaultAdminAuthModule } from 'nestjs-admin'

@Module({
  imports: [/* ... */, DefaultAdminModule, DefaultAdminAuthModule],
  /* ... */,
})
export class AppModule {
  // This is optional, to allow you manage AdminUsers from the admin
  adminSite.register('Administration', AdminUser)
}
```

Navigating to `/admin`, you should be redirected to `/admin/login` and see a login page. But you don't have any existing UserAdmin yet that you can login with, so you'll need to create one manually, see next section.

### Create an AdminUser manually

We'll want to be able to create an AdminUser manually through the command-line. This allows securely creating admins on your production servers. Only you have access to your application context, so it needs just a bit of setup on your part:

1. Create a `scripts/createAdmin.ts` with a content similar to this:

> you can put this `createAdmin.ts` wherever you want, not necessarily in a `script/` folder

```ts
import { NestFactory } from '@nestjs/core'
import { AdminUserService } from 'nestjs-admin/adminUser'
// Import your app module, path and name might be different
import { AppModule } from '../src/app.module'

async function bootstrap() {
  // Create the app context, instantiating modules, services, repositories...
  // see https://docs.nestjs.com/application-context for details
  const app = await NestFactory.createApplicationContext(AppModule)

  // Get the AdminUserService, you *need* to have it imported somewhere
  // in your application (like shown earlier in the doc)
  const adminUserService = app.get(AdminUserService)

  // We provide a utility that shows a nice prompt to ask for the data
  // necessary to create an AdminUser (email + password).
  // You're free to gather this data however you want and use
  // adminUserService.create(email, password) if you prefer.
  await adminUserService.promptAndCreate()
}

bootstrap()
```

2. (optional, recommended) You can create an entry in your `package.json` to call this script easily:

```js
"scripts": {
  // ...
  // with ts-node
  "admin:createAdmin": "ts-node scripts/createAdmin",
  // maybe you want to use node or tsconfig-path
  "admin:createAdmin": "node -r tsconfig-path/register -r ts-node/register scripts/createAdmin",
  // ...
},
```

Voilà, you can now create UserAdmins that can log into your administration interface with:

```bash
yarn admin:createAdmin # with yarn
npm run admin:createAdmin # with npm
```

If you did `adminSite.register(AdminUser)`, you can create more AdminUser directly from the administration interface now!
