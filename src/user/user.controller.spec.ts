import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, Repository } from 'typeorm';

import { UserController } from './user.controller';
import { UserDto } from './interfaces/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CrudRequest } from '@nestjsx/crud';

const USER_1: UserDto = { name: 'name1', email: 'email1', password: 'password1', roles: ['user'] };
const USER_2: UserDto = { name: 'name2', email: 'email2', password: 'password2', roles: ['admin'] };

const genericCrudRequest: CrudRequest = {
  parsed: {
    fields: [],
    paramsFilter: [],
    filter: [],
    or: [],
    join: [],
    sort: [],
    limit: undefined,
    offset: undefined,
    page: undefined,
    cache: undefined,
  },
 options:
  { query: {},
    routes: {
      getManyBase: { interceptors: [], decorators: [] },
      getOneBase: { interceptors: [], decorators: [] },
      createOneBase: { interceptors: [], decorators: [] },
      createManyBase: { interceptors: [], decorators: [] },
      updateOneBase: { interceptors: [], decorators: [], allowParamsOverride: false },
      deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
    },
    params: {
      id: {
        field: 'id',
        type: 'number',
        primary: true,
      },
    },
  },
};

describe('UserController', () => {
  let userController: UserController;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.clear();
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('user', () => {
    it('should find all users', async () => {
      const createdUser = await userRepository.save(USER_1);
      expect(await userController.getMany(genericCrudRequest)).toEqual([createdUser]);
    });

    it('should find a user by id', async () => {
      await userRepository.save(USER_1);
      const createdUser = await userRepository.save(USER_2);
      const createdUserId = createdUser.id.toString();
      const requestWithParamFilters: CrudRequest = {
        ...genericCrudRequest,
        parsed: {
          ...genericCrudRequest.parsed,
          paramsFilter: [{ field: 'id', operator: 'eq', value: createdUserId }],
        },
      };
      expect(await userController.getOne(requestWithParamFilters)).toEqual(createdUser);
    });

    it('should create a user', async () => {
      const createdUser = await userController.createOne(USER_1);
      const createdUserId = createdUser.id.toString();
      const { password, ...storedUserWithPassword } = await userRepository.findOneOrFail(
        createdUserId,
      );
      expect(storedUserWithPassword).toEqual(createdUser);
    });

    it('should update a user', async () => {
      const { id } = await userRepository.save(USER_1);
      const createdUserId = id.toString();
      const updatedUser = await userController.update(createdUserId, USER_2);
      expect(await userRepository.findOne(createdUserId)).toEqual(updatedUser);
    });

    it('should delete a user', async () => {
      const { id } = await userRepository.save(USER_1);
      const createdUserId = id.toString();
      const requestWithParamFilters: CrudRequest = {
        ...genericCrudRequest,
        parsed: {
          ...genericCrudRequest.parsed,
          paramsFilter: [{ field: 'id', operator: 'eq', value: createdUserId }],
        },
      };
      expect(await userRepository.findOne(createdUserId)).toBeTruthy();
      await userController.deleteOne(requestWithParamFilters);
      expect(await userRepository.findOne(createdUserId)).toBeUndefined();
    });
  });
});
