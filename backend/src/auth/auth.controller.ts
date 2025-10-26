import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guards';
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
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
        };
    }


}
