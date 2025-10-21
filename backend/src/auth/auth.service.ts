import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import  * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }
    public async validateUser(loginDto: LoginDto) {
        try {
            const foundUser = await this.prisma.user.findUnique({
                where: {
                    email: loginDto.email
                }
            })
            if (!foundUser) {
                throw new UnauthorizedException('user not found');
            }
            const isPasswordCorrect = await bcrypt.compare(loginDto.password, foundUser.password);
            if (!isPasswordCorrect) {
                throw new UnauthorizedException('password incorrect');
            }
            return {token: this.jwtService.sign({
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
            }), id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,};
        } catch (error) {
            console.error('Error validating user:', error);
            throw error;
        }
    }
}
