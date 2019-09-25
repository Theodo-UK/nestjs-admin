---
id: contributing
title: Contributing
---

Any contribution is welcome. If you want to implement a feature, you need to know that we are following [django-admin's API](https://docs.djangoproject.com/en/2.2/ref/contrib/admin/) as closely as possible. Why?

- It's been well-thought-out by smart people
- Python translates well to Typescript
- It allows us to not have to think about what the API should look like and just use Django admin as a list of desirable features

## Start the example app

This repo contains an example of how to use nestjs-admin. Here's how to use it:

```bash
# In a first terminal, run the database
cp .env.example .env
docker-compose up

# In a second terminal, compile the library
yarn install
yarn link
yarn start:dev

# In a third terminal, run the example app
cd exampleApp/
yarn install
yarn link nestjs-admin
yarn migration:run
yarn start:debug
```

You can now create an AdminUser (`yarn nestjs-admin createAdminUser`) to be able to login to `localhost:8000/admin`.

The code for the actual library is in `libs/nestjs-admin`.
