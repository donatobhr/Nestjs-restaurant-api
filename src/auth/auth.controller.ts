import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
    
    @Post('/signup')
    signUp(@Body() user: UserDto): Promise<{token: string}>
    {
        return this.authService.signUp(user);
    }


    @Post('/login')
    login(@Body() user: Partial<UserDto>): Promise<{token: string}>
    {
        return this.authService.login(user);
    }
}
