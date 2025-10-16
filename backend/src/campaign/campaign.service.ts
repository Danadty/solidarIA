import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) { }

  public async create(createCampaignDto: CreateCampaignDto) {
    try {

      const existFoundation = await this.prisma.foundation.findUnique({
        where: {
          id: createCampaignDto.foundationId,
        },
      });
      if (!existFoundation) {
        throw new BadRequestException('Foundation not found');
      }
      // Validar fechas
      if (new Date(createCampaignDto.endDate) <= new Date(createCampaignDto.startDate)) {
        throw new BadRequestException('End date must be after start date');
      }
      const newCampaign = await this.prisma.campaign.create({
        data: {
          title: createCampaignDto.title,
          description: createCampaignDto.description,
          imageUrl: createCampaignDto.imageUrl,
          start_Date: new Date(createCampaignDto.startDate),
          end_Date: new Date(createCampaignDto.endDate),
          foundationId : createCampaignDto.foundationId,
        },
      });

      return {
        message: 'Campaign created successfully',
        campaign: newCampaign,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Campaign with title "${createCampaignDto.title}" already exists.`);
      }
      console.error('Error creating campaign:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async findAll() {
    const campaigns = await this.prisma.campaign.findMany();
    return campaigns.map(campaign => ({
      ...campaign,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  public async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format for id: ${id}`);
    }

    try {
      // Verificar que exista
      const campaign = await this.prisma.campaign.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign with id ${id} not found`);
      }

      // Eliminar
      await this.prisma.campaign.delete({
        where: { id },
      });

      return { message: `Campaign with id ${id} has been deleted.` };
    }
    catch (error) {
      console.error('Error deleting campaign:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }
}
