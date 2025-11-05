import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Foundation } from './entities/foundation.entity';
import { validate as isUUID } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class FoundationService {
  constructor(private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  public async create(createFoundationDto: CreateFoundationDto) {
    try {

      
      const newID = uuidv4();
      console.log(createFoundationDto);
      // user if exists
      const user = await this.prisma.user.findUnique({
        where: {
          id: createFoundationDto.userId,
        },
      })
      if (!user) {
        throw new NotFoundException(`User with id ${createFoundationDto.userId} not found`);
      }

      // if (user.role !== 'FOUNDATION') {
      //   await this.prisma.user.update({
      //     where: { id: user.id },
      //     data: { role: 'FOUNDATION' },
      //   });
      // }

      const foundation = await this.prisma.foundation.create({
        data: {
          id: newID,
          name: createFoundationDto.name,
          description: createFoundationDto.description,
          contact_phone: createFoundationDto.contact_phone,
          contact_email: createFoundationDto.contact_email,
          userId: createFoundationDto.userId,
        }
      });
      return ({
        ...foundation
      });
    } catch (error) {
      console.error('Error creating foundation:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async findAll() {
    const foundations = await this.prisma.foundation.findMany()
    return foundations.map(foundation => ({
      ...foundation,
    }));

  }

 

  public async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }
    
    const foundation = await this.prisma.foundation.findUnique({
      where: {
        id: id,
      },
    })
    if (!foundation) {
      throw new Error(`Foundation with id ${id} not found`);
    }
    // devolver con campañas
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        foundationId: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_Date: true,
        end_Date: true,
        imageUrl:true,
      },
    });
     return {
      ...foundation,
      campaigns: campaigns,
    };
  }

  public async update(id: string, updateFoundationDto: UpdateFoundationDto) {

    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }

    // exista
    const foundation = await this.prisma.foundation.findUnique({
      where: { id },
    });

    if (!foundation) {
      throw new NotFoundException(`Foundation with id ${id} not found`);
    }

    // Actualizar
    const updatedFoundation = await this.prisma.foundation.update({
      where: { id },
      data: { ...updateFoundationDto },
    });

    return updatedFoundation;
  }

  public async remove(id: string) {

    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }

    // Verificar que exista
    const foundation = await this.prisma.foundation.findUnique({
      where: { id },
    });

    if (!foundation) {
      throw new NotFoundException(`Foundation with id ${id} not found`);
    }

    if(foundation.logoPublicId){
      // Eliminar
      await this.cloudinaryService.deleteImage(foundation.logoPublicId);
    }
    // Eliminar
    await this.prisma.foundation.delete({
      where: { id },
    });

    return { message: `Foundation with id ${id} has been deleted.` };
  }


  public async updateLogo(foundationId: string, image: { url: string; publicId: string }) {
    try {
      // Verificar que exista
      const foundation = await this.prisma.foundation.findUnique({
        where: { id: foundationId },
      });

      if (!foundation) {
        throw new NotFoundException(`Foundation with id ${foundationId} not found`);
      }

      // Actualizar
      const updatedFoundation = await this.prisma.foundation.update({
        where: { id: foundationId },
        data: { logo_url: image.url, logoPublicId: image.publicId },
      });

      return updatedFoundation;
    } catch (error) {
      console.error('Error updating foundation logo:', error);
      throw error;
    }
  }

  //parte de las imagenes 

  public async deleteLogo(foundationId: string) {
    try {
      // Verificar que exista
      const foundation = await this.prisma.foundation.findUnique({
        where: { id: foundationId },
      });

      if (!foundation) {
        throw new NotFoundException(`Foundation with id ${foundationId} not found`);
      }

      if(foundation.logoPublicId){
        // Eliminar
        await this.cloudinaryService.deleteImage(foundation.logoPublicId);
      }
      // Eliminar
      await this.prisma.foundation.update({
        where: { id: foundationId },
        data: { logo_url: null, logoPublicId: null },
      });

      return { message: `Logo of foundation with id ${foundationId} has been deleted.` };
    } catch (error) {
      console.error('Error deleting foundation logo:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

    public async checkFoundation(userId: string) {
    const foundation = await this.prisma.foundation.findUnique({
      where: { userId },
    });

    return {
      exists: !!foundation,
      foundation,
    };
  }
}
