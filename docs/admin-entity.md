---
id: admin-entity
title: AdminEntity API
sidebar_label: AdminEntity
---

## AdminEntity options

All options are defined on the AdminEntity class:

```typescript
// user.admin.ts
import { AdminEntity } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['firstname', 'lastname']
}
```

### AdminEntity.fields

Configures which fields of the entity will be displayed (and therefore editable) in the create and update forms.

```typescript
fields = ['firstName', 'lastName', 'createdDate', 'gender']
```

![image](assets/AdminEntity.fields.jpeg)

- If you don't set `fields`, the create and update forms will display all properties of the entity

### AdminEntity.listDisplay

Configures which fields of the entity will be displayed on the list page.

```typescript
listDisplay = ['id', 'firstname', 'lastname', 'email']
```

![image](assets/AdminEntity.listDisplay.png)

- If you don't set `listDisplay`, the list page will display a single column containing the primary key of the entity, or the `toString()` representation of the entity if defined.

- `listDisplay` values cannot refer to `ManyToOne`, `OneToMany` or `ManyToMany` fields.

### AdminEntity.searchFields

Configures whether the search box will be displayed on the list page, and which fields of the entity will be searched.

```typescript
searchFields = ['firstName', 'lastName', 'createdDate', 'gender']
```

![image](assets/AdminEntity.searchFields.png)

- If you don't set `searchFields`, the search box will not be displayed on the list page.
- If you search for `john`, the entity instances will be displayed if `john` appears in any of the configured fields.
- If you search for `john smith`, an entity instance will be displayed if `john` appears in any of the configured fields AND if `smith` appears in any of the configured fields.
