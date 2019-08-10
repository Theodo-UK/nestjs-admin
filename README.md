<h1 align="center">
  NestJS Admin
</h1>
<h3 align="center">
  A generic administration interface for TypeORM entities
</h3>
<a href="https://www.npmjs.com/package/nestjs-admin"><img src="https://img.shields.io/npm/v/nestjs-admin.svg" alt="NPM Version" /></a>

## Description

Ready-to-use user interface for administrative activities. Allows to list, edit, create, delete entities.

This is heavily, heavily inspired by [Django admin](https://djangobook.com/mdj2-django-admin/), from the concept to the API.

> This is still very much a work in progress. Most of the functionalities aren't there, and in particular there is no authentication for the admin interface yet.
>
> Your help is more than welcome!

## Installation

Add nestjs-admin to your dependencies:

```bash
yarn add nestjs-admin # With yarn
npm install nestjs-admin # With NPM
```

Add the AdminModule to your app modules:

```ts
// app.module.ts
// ...
import { AdminModule } from '@app/nestjs-admin'

@Module({
  imports: [TypeOrmModule.forRoot(), AdminModule /* ... */],
  controllers: [
    /* ... */
  ],
  providers: [
    /* ... */
  ],
})
export class AppModule {}
```

Register the entities you want to administrate in the admin site:

```ts
// user.module.ts
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { User } from './user.entity'
import { AdminModule, AdminSite } from '@app/nestjs-admin'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: AdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('User', User)
  }
}
```

You can now access the admin interface at `/admin`!

## Contributing

Any contribution is welcome. If you want to implement a feature, you need to know that we are following [django-admin's API](https://docs.djangoproject.com/en/2.2/ref/contrib/admin/) as closely as possible. Why?

- It's been well-thought-out by smart people
- Python translates well to Typescript
- It allows us to not have to think about what the API should look like and just use Django admin as a list of desirable features

This repo is actually an example of how to use nestjs-admin. You can `docker-compose up`, `yarn start:debug` and go to `localhost:8000/admin` to see an admin interface for a complex entity. The code for the admin module is in `libs/nestjs-admin`.

If you use VSCode, a `.vscode/` is committed that contains a good configuration to contribute. In particular, it contains a config for the debugger.
