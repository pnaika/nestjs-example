import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthCredDto } from "./dto/auth-cred.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('signUp')
  signUp(@Body(ValidationPipe) authCredDto: AuthCredDto): Promise<void> {
    return this.authService.singUp(authCredDto);
  }

  @Post('signIn')
  signIn(@Body(ValidationPipe) authCredDto: AuthCredDto): Promise<{accessToken}>{
    return this.authService.signIn(authCredDto);
  }
}
