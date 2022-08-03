import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: AuthDto) {
       return this.authService.signup(dto);
    }

    @Post('signin')
    async signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
        
    }
}