import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) { }

  public async create(createUserProfileDto: CreateUserProfileDto) {

    try {
      const { userId, description, photoUrl, phone, address } = createUserProfileDto;
      // Validar que exista el usuario
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      // Crear perfil
      const userProfile = await this.prisma.userProfile.create({
        data: { userId, description, photoUrl, phone, address }
      });

      return {
        message: 'User profile created successfully',
        userProfile: userProfile,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

    public async findAll() {

      try {
        const profiles = await this.prisma.userProfile.findMany({
      select: {
        id: true,
        description: true,
        photoUrl: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        //info del usuario:
        // user: { select: { id: true, name: true, email: true } },
      },
    });

    return profiles;
      } catch (error) {
        console.error('Error fetching user-profile:', error);
        throw error;
      }
    }

    findOne(id: number) {
      return `This action returns a #${id} userProfile`;
    }

    update(id: number, updateUserProfileDto: UpdateUserProfileDto) {
      return `This action updates a #${id} userProfile`;
    }

    public async remove(id: string) {
      try{
        if (!isUUID(id)) {
          throw new BadRequestException(`Invalid UUID format for id: ${id}`);
        }
        // Verificar que exista
        const profile = await this.prisma.userProfile.findUnique({
          where: { id },
        });

        if (!profile) {
          throw new NotFoundException(`User profile with id ${id} not found`);
        }

        // Eliminar
        await this.prisma.userProfile.delete({
          where: { id },
        });

        return { message: `User profile with id ${id} has been deleted.` };
      }catch (error) {
        console.error('Error deleting user profile:', error);
        throw error; // re-lanza la excepción para que NestJS la maneje
      }
    }
  }
