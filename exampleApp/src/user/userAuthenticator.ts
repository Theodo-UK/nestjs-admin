import { User } from './user.entity'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export const UserAuthenticator = {
  imports: [TypeOrmModule.forFeature([User])],
  // @ts-ignore
  useFactory: (userRepository: Repository<User>) => {
    return async function validateCredentials(email: string, pass: string) {
      const user: User | null = await userRepository.findOne({ email })
      if (user && pass === user.password) {
        return user
      }
      return null
    }
  },
  inject: [getRepositoryToken(User)],
}
