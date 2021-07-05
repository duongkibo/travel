import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninInput } from '../dto/signin.input';
import { AuthService } from '../services/auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('/signin')
    async signUp(@Body() signin: SigninInput) {
      return this.authService.login(signin.email, signin.password);
    }
}
