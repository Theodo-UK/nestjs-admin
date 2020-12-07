import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export const UserCredentialValidator = {
  useFactory: (userRepository: Repository<User>) => {
    return async function validateCredentials(email: string, password: string) {
      const user: User | null = await userRepository.findOne({ email });
      if (user && password === user.password) {
        return user;
      }
      return null;
    };
  },
  inject: [getRepositoryToken(User)],
};
