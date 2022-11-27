import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
    
    @Post('/signup')
    signUp(@Body() user: UserDto): Promise<{token: string}>
    {
        return this.authService.signUp(user);
    }


    @Post('/login')
    @HttpCode(200)
    login(@Body() user: Partial<UserDto>): Promise<{token: string}>
    {
        return this.authService.login(user);
    }
}
