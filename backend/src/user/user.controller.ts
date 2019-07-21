import { Controller, Param, Body, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserDto } from './interfaces/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/role.guard';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest, ParsedBody } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController implements CrudController<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    public readonly service: UserService,
  ) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  createOne(@Body() userDto: UserDto) {
    return this.service.createUser(userDto);
  }

  @Override()
  @Roles('admin')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override()
  @Roles('admin')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userRepository.save({ ...userDto, id: Number(id) });
  }

  @Override()
  @Roles('admin')
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
