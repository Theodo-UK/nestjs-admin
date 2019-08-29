import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Credentials } from './interfaces/credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/user.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { JwtToken } from './interfaces/jwt-token.interface';
import { compare } from 'bcrypt';

const ACCESS_TOKEN_MINUTES_TO_LIVE = 10;
const REFRESH_TOKEN_MINUTES_TO_LIVE = 525600; // 1 year

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkCredentials(credentials: Credentials): Promise<JwtToken> {
    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ email: credentials.email });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw error;
    }
    const areCredentialsValid = await compare(credentials.password, user.password);
    if (!areCredentialsValid) {
      throw new UnauthorizedException();
    }

    return {
      access: this.createJwt(user, ACCESS_TOKEN_MINUTES_TO_LIVE),
      refresh: this.createJwt(user, REFRESH_TOKEN_MINUTES_TO_LIVE),
    };
  }

  async checkRefreshToken(stringToken: string): Promise<string> {
    try {
      const now = new Date();

      const refreshToken: JwtPayload = this.jwtService.verify(stringToken);

      if (now.getTime() / 1000 > refreshToken.exp) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository.findOneOrFail(refreshToken.user_id);
      return this.createJwt(user, ACCESS_TOKEN_MINUTES_TO_LIVE);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }

  createJwt(user: User, minutesToLive: number): string {
    return this.jwtService.sign({ user_id: user.id }, { expiresIn: minutesToLive * 60 });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(payload.user_id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
