# Authenticate to the admin interface

## Status

Approved

## Context

The admin interface obviously cannot be public for the vast majority of websites. This means that we need to provide a way to handle authentication and authorization.

### Characteristics

We want this authentication system to be:

- Easy to set up for nestjs-admin developers (or better: working out-of-the-box)
- Extensible to handle a wide range of use cases

### What does django-admin do?

Django-admin uses the builtin "user" model, that has a username and password. It allows them to rely on these fields for authentication, in addition to `is_staff` and `is_superuser` fields.

### Challenges

1. NestJS, as opposed to frameworks like Django, has no built-in concept of "user" with a username and password. We cannot rely on this.
2. Users come in all shapes and form: identified through username, email, id, using a password or not... There's no invariant we can rely on.
3. We need to make sure whatever solution we choose doesn't lock everybody out of the admin interface by default (we need to manually be able to create an admin, like django-admin with `./manage.py createsuperuser`)

### Options

1. Have the developer extend the Admin controller, which will allow them to define their own guard and authentication logic

   - Very flexible
   - Nothing to do for us but documentation
   - Lot of friction to start using nestjs-admin, it makes the lib not usable out-of-the-box

2. Add some config for the admin module to specify the User entity, which needs to implement some AdminUserInterface (getAdminUsername, getAdminPassword, isAdmin). We can then have a guard to implement authentication/authorization.

   - Need to implement a login page
   - Not very flexible, we'll have to make assumptions (user has a username and a password)

3. Provide an AdminUser entity out-of-the-box, that has a username and password.

   - Need to implement a login page
   - Not very flexible. Admin entities are distinct from User entities, which is annoying (how to create admins? Choose their password?).
   - Works entirely out-of-the-box

## Decision

The N.1 concern at the time is to make this library self-contained, usable out-of-the-box. For this reason, we'll go for option 3.

The downsides of this option (flexibility, Users distinct from Admins) can be mitigated:

- For more flexibility, we could also provide a AdminUserInterface, that can be implemented by another entity (a User entity very probably) and allow configuring the AdminModule to use this entity (option 2)
- We can still let the developer extend the admin controller to implement their own guard (option 1., need to document how)

## Consequences / roadmap

The very first step is to implement option 3 (login page, AdminUser entity, authentication logic). This will make this library valuable. This is a high priority, Theodo developers are assigned to it.

Second step would be to expose an AdminUserInterface that can be implemented instead of the builtin AdminUser (option 2). This is a medium priority, would allow a better experience for a number of projects. Feel free to discuss it further / send a PR.

Finally, documenting how to extend the controller to add a custom guard would allow maximum flexibility. Feel free to discuss it further / send a PR.
