import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from './user.entity';
import { UserDto } from './interfaces/user.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository);
  }

  createUser = async (userDto: UserDto) => {
    const plainPassword = userDto.password;
    const encryptedPassword = await hash(plainPassword, SALT_ROUNDS);
    const createdUser = await this.userRepository.save({ ...userDto, password: encryptedPassword });
    const { password, ...createdUserDto } = createdUser;
    return createdUserDto;
  };
}
