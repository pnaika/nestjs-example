import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";
import { AuthCredDto } from "./dto/auth-cred.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async singUp(authCredDto: AuthCredDto): Promise<void> {
    const { username, password } = authCredDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);


    try {
      await user.save();
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Username already exist");
      }

      throw new InternalServerErrorException();
    }
  }

  public async validateUserPassword(authCredDto: AuthCredDto) {
    const { username, password } = authCredDto;

    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    }

    return null;
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
