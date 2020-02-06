---
id: custom-authentication
title: Custom authentication
---

NestJS does not provide a built-in concept of "user". It is up to the application developper to define it if it makes sense in their application. To be able to be secure and usable out-of-the-box, NestJS Admin provides an AdminUser entity that contains a `username` and a `password` properties. You can create a new AdminUser from the command line (`npx nestjs-admin createAdminUser`) or through the admin interface directly: these credentials will allow you to login into the admin interface.

NestJS Admin provides way to customize this behavior.

## Use your own User entity

If your application already has a concept of User, you might want to use this to login into the admin interface, not using the provided AdminUser at all. NestJS Admin provides an easy way to validate the username/password against whatever makes sense in your application (your own User entity, a list of hardcoded admins...).

Let's assume your User entity looks somehow like this:

```ts
@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ length: 128, unique: true, nullable: false })
  email: string

  @Column({ length: 128, nullable: false })
  password: string

  @Column('boolean', { nullable: true })
  isAdmin: boolean
}
```

Great. Now, you'll want to use a user's email and password for admin login. For this, we'll need to look into how an admin module works, let's take a dive into the DefaultAdminModule provided by NestJS Admin.

The `DefaultAdminModule` is actually just a wrapper around 2 modules: the `AdminCoreModule` and the `UserAdminModule`.

- The `AdminCoreModule` provides all the CRUD functionalities. All of the endpoints it provides _require_ a logged-in user: `request.user` must be truthy or an exception will be thrown.
- The `UserAdminModule` provides an additional endpoint: `/admin/login` and listens to exceptions thrown by the `AdminCoreModule`. If an Unauthorized exceptions is thrown, it intercepts it and redirects to `/admin/login`. On submit of the login form, it checks the credentials against existing AdminUsers, and logs the user in if the credentials are valid.

So really, what the `UserAdmin` does is completely generic _except_ for the "check the credentials" part. Well actually, all this generic stuff is handled by a 3rd module: the `AdminAuthModule`, the `UserAdminModule` is simply an instance of the `AdminAuthModule`, with a bit of configuration to define how to "check the credentials" for a UserAdmin. Let's do the same thing with our User.

First, that means that we won't use the `DefaultAdminModule` anymore, you need to create your own admin module (let's call it `BackofficeModule` for clarity):

```bash
npx nest generate module backoffice
```

Then add it to you `AppModule` (and remove the DefaultAdminModule if needed):

```ts
// src/app.module.ts
import { Module } from '@nestjs/common'
import { BackofficeModule } from './backoffice'

@Module({
  imports: [TypeOrmModule.forRoot(), /* ... */, BackofficeModule],
  /* ... */,
})
export class AppModule {
  /* ... */
}
```

Let's have our BackofficeModule actually provide admin functionalities:

```ts
// src/backoffice/backoffice.module.ts
import { AdminCoreModuleFactory } from 'nestjs-admin'

const CoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Module({
  imports: [CoreModule],
})
export class BackofficeModule {}
```

At this point, any request to `/admin/*` will fail because the user won't be authenticated (`request.user` is never set). We need to instantiate the provided `AdminAuthModuleFactory`, telling it how to validate credentials.

To validate credentials, you'll probably need to have access to some Nest providers: your User entity's repository at the very least. For this we use the [factory provider pattern](https://docs.nestjs.com/fundamentals/custom-providers). It can look complicated, but it's fairly easy to use:

```ts
// src/backoffice/credentialValidator.ts

import { CredentialValidatorProvider } from 'nestjs-admin'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity.ts'

export const adminCredentialValidator: CredentialValidatorProvider = {
  imports: [TypeOrmModule.forFeature([User])], // will make the User repository available for injecting
  inject: [getRepositoryToken(User)], // injects the User repository in the factory
  useFactory: (UserRepository: Repository<User>) => {
    // You can now return a function to validate the credentials
    return async function(email: string, password: string) {
      const user: User | null = await userRepository.findOne({ email })
      // Note: here we're assuming the password is in plaintext in the database.
      // Never do that in a real app! You should hash your password and compare hashes
      if (user && user.isAdmin && password === user.password) {
        return user
      }
      return null // The credentials do not identify an administor
    }
  },
}
```

A bit terse, but nothing incredible:

- The `useFactory` function takes whatever Nest providers you'll need as arguments, and return a validation function
  - Here we use a repository, but you could use whatever you want (such as a `UserService` you defined in your User module for example)
- `inject` contains the injection tokens for the services you want to inject in your factory (in the same order than the arguments of the factory).
  - It is whatever you'd pass to the `@Inject` decorator.
  - If you want to inject one of your own providers, chances are that you'll just give the provider class itself in the `inject` array (eg `UserService`)
- `imports` contains the list of modules that export the Nest providers you're injecting into your factory function.
  - If you are injecting your `UserService`, you'll need to import your `UserModule`

Now, we can use this validator to instantiate the `AdminAuthModuleFactory`:

```ts
// src/backoffice/backoffice.module.ts
import { AdminCoreModuleFactory, AdminAuthModuleFactory } from 'nestjs-admin'
import { adminCredentialValidator } from './credentialValidator'

const CoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
const AuthModule = AdminAuthModuleFactory.createAdminAuthModule({
  adminCoreModule: CoreModule, // what core module are you authenticating
  credentialValidator: adminCredentialValidator, // how do you validate credentials
})

@Module({
  imports: [CoreModule, AuthModule],
})
export class BackofficeModule {}
```

And you're done! You can now use any of your User's credentials to log into the admin interface, as long as they have the `isAdmin` property set to `true`.

## Completely custom authentication

It is possible that the above solution is not enough for you: maybe you don't use username/passwords for your users (OAuth, MFA, magic link...). In this case, forget about the `AdminAuthModule`: you'll have to write your own authentication module.

There's no restriction or guideline on how to do that: the only requirement is that you'll need to populate the `request.user` property on `/admin` routes. Feel free to look at how the `AdminAuthModule` uses middlewares and sessions for that.

Assuming you've written your authentication module, you can use it like this:

```ts
// src/backoffice/backoffice.module.ts
import { AdminCoreModuleFactory } from 'nestjs-admin'
import { MyAdminAuthModule } from './myadminauth.module'

const CoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Module({
  imports: [CoreModule, MyAdminAuthModule],
})
export class BackofficeModule {}
```

Good luck, feel free to ask for help!
