import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

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
          // imageUrl: createCampaignDto.imageUrl,
          start_Date: new Date(createCampaignDto.startDate),
          end_Date: new Date(createCampaignDto.endDate),
          foundationId: createCampaignDto.foundationId,
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
      if (campaign.publicId) {
        await this.cloudinaryService.deleteImage(campaign.publicId);
      }

      const campaignImages = await this.prisma.campaignImage.findMany({
        where: { campaignId: id },
      });

      for (const img of campaignImages) {
        if (img.public_id) {
          await this.cloudinaryService.deleteImage(img.public_id);
        }
      }

      await this.prisma.campaignImage.deleteMany({ where: { campaignId: id } });

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

  // public async uploadPortada(file: Express.Multer.File, campaignid: string) { 

  //   if (!isUUID(campaignid)) {
  //     throw new BadRequestException(`Invalid UUID format for id: ${campaignid}`);
  //   }
  //   try {
  //     // Verificar que exista
  //     const campaign = await this.prisma.campaign.findUnique({
  //       where: { id: campaignid },
  //     });

  //     if (!campaign) {
  //       throw new NotFoundException(`Campaign with id ${campaignid} not found`);
  //     }
  //     const result = await this.cloudinaryService.uploadImage(file);
  //     // 3️⃣ Guardar la URL y public_id en la campaña
  //     const updatedCampaign = await this.prisma.campaign.update({
  //       where: { id: campaignid },
  //       data: {
  //         imageUrl: result.url,
  //         publicId: result.public_id,
  //         },
  //       });
  //       return {
  //         message: 'Portada actualizada correctamente',
  //         portadaUrl: updatedCampaign.imageUrl,
  //         publicId: updatedCampaign.publicId,
  //       };
  //     } catch (error) {
  //       console.error('Error actualizando portada:', error);
  //       throw error; // re-lanza la excepción para que NestJS la maneje
  //     }

  // }
  public async uploadOrUpdatePortada(file: Express.Multer.File, campaignid: string) {
    if (!file) {
      throw new Error('No file provided');
    }
    if (!isUUID(campaignid)) {
      throw new BadRequestException(`Invalid UUID format for id: ${campaignid}`);
    }
    try {
      // Verificar que exista
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignid },
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign with id ${campaignid} not found`);
      }
      if (campaign.publicId) {
        await this.cloudinaryService.deleteImage(campaign.publicId);
      }
      const result = await this.cloudinaryService.uploadImage(file);
      // 3️⃣ Guardar la URL y public_id en la campaña
      const updatedCampaign = await this.prisma.campaign.update({
        where: { id: campaignid },
        data: {
          imageUrl: result.url,
          publicId: result.public_id,
        },
      });
      // 4 Retornar respuesta al cliente
      return {
        message: 'Portada actualizada correctamente',
        portadaUrl: updatedCampaign.imageUrl,
        // publicId: updatedCampaign.publicId,
      };
    } catch (error) {
      console.error('Error actualizando portada:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }

  }

  public async uploadImage(file: Express.Multer.File, campaignid: string, description: string) {
    if (!file) throw new BadRequestException('No file provided');

    if (!isUUID(campaignid)) {
      throw new BadRequestException(`Invalid UUID format for id: ${campaignid}`);
    }
    try {
      // Verificar que exista
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignid },
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign with id ${campaignid} not found`);
      }
      const result = await this.cloudinaryService.uploadImage(file);

      const newCampaignImage = await this.prisma.campaignImage.create({
        data: {
          description: description,
          image_Url: result.url,
          public_id: result.public_id,
          campaignId: campaignid,
        },
      });
      return {
        message: 'Imagen subida correctamente',
        imageUrl: newCampaignImage.image_Url,
        publicId: newCampaignImage.public_id,
      };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async deleteCampaignImage(imageId: string) {
    if (!isUUID(imageId)) {
      throw new BadRequestException(`Invalid UUID format for id: ${imageId}`);
    }
    try {
      // Verificar que exista
      const campaignImage = await this.prisma.campaignImage.findUnique({
        where: { id: imageId },
      });

      if (!campaignImage) {
        throw new NotFoundException(`Campaign image with id ${imageId} not found`);
      }
      // 1️⃣ Borrar la imagen en Cloudinary usando publicId
      if (campaignImage.public_id) {
        await this.cloudinaryService.deleteImage(campaignImage.public_id);
      }
      // 2️⃣ Borrar el registro en la base de datos
      await this.prisma.campaignImage.delete({ where: { id: imageId } });

      return { message: 'Imagen de campaña eliminada correctamente' };
    } catch (error) {
      console.error('Error deleting campaign image:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }

  }

  public async getCampaignImages(campaignId: string) {
    if (!isUUID(campaignId)) {
      throw new BadRequestException(`Invalid UUID format for id: ${campaignId}`);
    }
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { campaignImage: true },
      });
      if (!campaign) {
        throw new NotFoundException(`Campaign with id ${campaignId} not found`);
      }
      return campaign.campaignImage.map(img => ({
        id: img.id,
        description: img.description,
        image_Url: img.image_Url,
      }));
    } catch (error) {
      console.error('Error fetching campaign images:', error);
      throw error;

    }
  }

}
