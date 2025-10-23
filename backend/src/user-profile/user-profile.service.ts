import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  public async create(createUserProfileDto: CreateUserProfileDto) {

    try {
      const { userId, description, phone, address } = createUserProfileDto;
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
        data: { userId, description, phone, address }
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

  // findOne(id: number) {
  //   return `This action returns a #${id} userProfile`;
  // }

  // update(id: number, updateUserProfileDto: UpdateUserProfileDto) {
  //   return `This action updates a #${id} userProfile`;
  // }

  public async remove(id: string) {
    try {
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
      if (profile.publicId) {
        await this.cloudinaryService.deleteImage(profile.publicId);
      }



      // Eliminar
      await this.prisma.userProfile.delete({
        where: { id },
      });

      return { message: `User profile with id ${id} has been deleted.` };
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async uploadPhoto(file: Express.Multer.File, userid: string) {

    try {
      // Verificar que exista
      const profile = await this.prisma.userProfile.findUnique({
        where: { id: userid },
      });
      if (!profile) {
        throw new NotFoundException(`User profile with id ${userid} not found`);
      }
      const uploaded = await this.cloudinaryService.uploadImage(file);

      return this.prisma.userProfile.update({
        where: { id: userid },
        data: {
          photoUrl: uploaded.url,
          publicId: uploaded.public_id,
        },
      });
    } catch (error) {
      console.error('Error updating user profile photo:', error);
      throw error;
    }
  }

  public async updatePhoto(id: string, image: { url: string; publicId: string }) {
    try {
      // Verificar que exista
      const profile = await this.prisma.userProfile.findUnique({
        where: { id },
      });

      if (!profile) {
        throw new NotFoundException(`User profile with id ${id} not found`);
      }
      if (profile.publicId) {
        await this.cloudinaryService.deleteImage(profile.publicId);
      }


      // Actualizar
      const updatedProfile = await this.prisma.userProfile.update({
        where: { id },
        data: { photoUrl: image.url, publicId: image.publicId },
      });

      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile photo:', error);
      throw error;
    }
  }

  //eliminar foto
  public async deletePhoto(userid: string) {
    try {
      // Verificar que exista
      const profile = await this.prisma.userProfile.findUnique({
        where: { id: userid },
      });
      if (!profile) {
        throw new NotFoundException(`User profile with id ${userid} not found`);
      }
      // Eliminar
      if (profile.publicId) {
        await this.cloudinaryService.deleteImage(profile.publicId);
      }
      await this.prisma.userProfile.update({
        where: { id: userid },
        data: { publicId: null, photoUrl: null },
      });
      return { message: `User profile with id ${userid} has been deleted.`, profile };
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }
    try {
      const profile = await this.prisma.userProfile.findUnique({
        where: { id },
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
          user: { select: { id: true, name: true, email: true } },
        },
      });
      if (!profile) {
        throw new NotFoundException(`User profile with id ${id} not found`);
      }
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new BadRequestException('Error fetching user profile');
    }

  }

  public async update(id: string, updateUserProfileDto: UpdateUserProfileDto) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }
    try {
      // Verificar que exista
      const profile = await this.prisma.userProfile.findUnique({
        where: { id },
      });

      if (!profile) {
        throw new NotFoundException(`User profile with id ${id} not found`);
      }

      // Evitar actualización de userId (protegido)
      const { userId: _, ...safeData } = updateUserProfileDto;

      const updatedProfile = await this.prisma.userProfile.update({
        where: { id },
        data: {
          ...safeData,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          description: true,
          photoUrl: true,
          phone: true,
          address: true,
          updatedAt: true,
        },
      });
      return {
        message: 'User profile updated successfully',
        updatedProfile,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new BadRequestException('Error updating user profile');
    }
  }


}
