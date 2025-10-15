import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Foundation } from './entities/foundation.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FoundationService {
  constructor(private prisma: PrismaService) { }

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

      if (user.role !== 'FOUNDATION') {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { role: 'FOUNDATION' },
        });
      }

      const foundation = await this.prisma.foundation.create({
        data: {
          id: newID,
          name: createFoundationDto.name,
          description: createFoundationDto.description,
          logo_url: createFoundationDto.logo_url,
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
    return {
      ...foundation,
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

    // Eliminar
    await this.prisma.foundation.delete({
      where: { id },
    });

    return { message: `Foundation with id ${id} has been deleted.` };
  }
}
