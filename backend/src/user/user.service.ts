import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { isUUID } from 'class-validator';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  public async create(createUserDto: CreateUserDto) {

    try {


      // check if user exists with mail
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      })
      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }

      const newID = uuidv4();
      console.log(createUserDto);
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // create user
      const user = await this.prisma.user.create({
        data: {
          id: newID,
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          role: 'USER', // default role
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // return whitout password
      const { password, ...userWithoutPassword } = user;
      return ({
        ...userWithoutPassword,
      });
    }
    catch (error) {
      console.error('Error creating user:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async findAll() {
    const findAllUsers = await this.prisma.user.findMany({
      select: {
      id: true,
      name: true,
      email: true,
      role: true,
      },
    })
    return findAllUsers.map(user => ({
      ...user,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }

    try {

      // Verificar que exista
      const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Eliminar
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with id ${id} has been deleted.` };
  }catch (error) {
      console.error('Error deleting user:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }
}
