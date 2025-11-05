// import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole as UserModel } from '../../../generated/prisma';

export type User = UserModel;

// export type User = PrismaService['user'];
export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    FOUNDATION = 'FOUNDATION',
}