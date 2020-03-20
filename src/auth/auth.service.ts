import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredDto } from "./dto/auth-cred.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadInterface } from "./jwt-payload-interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService) {
  }

  singUp(authCredDto: AuthCredDto): Promise<void> {
    return this.userRepository.singUp(authCredDto);
  }

  async signIn(authCredDto: AuthCredDto): Promise<{accessToken}> {
    const username = await this.userRepository.validateUserPassword(authCredDto);

    if (!(!!username)) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayloadInterface = { username };
    const accessToken = await this.jwtService.sign(payload);

    return {accessToken};
  }
}
