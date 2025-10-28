import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Login user No have Token' })
    @Public()
    @Post('login')
    public async login(@Body() loginDto: LoginDto) {
        const userToken = await this.authService.validateUser(loginDto);
        if (!userToken) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return userToken;

    }


}
