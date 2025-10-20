import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignImageDto } from './dto/create-campaign-image.dto';
import { UpdateCampaignImageDto } from './dto/update-campaign-image.dto';
import { cloudinary } from 'src/cloudinary/cloudinary.provider';
import * as streamifier from 'streamifier';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { isUUID } from 'class-validator';

@Injectable()
export class CampaignImageService {
  constructor(private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  // first upload image
  private async uploadToCloudinary(file: Express.Multer.File, folder = 'APPong') {

    if (!file) throw new Error('No file provided');

    try {
      const result = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            // Aquí result ya está tipado correctamente
            if (!result) return reject(new Error('No result returned from Cloudinary'));

            resolve({ url: result.secure_url, public_id: result.public_id });
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      return result;
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  }

  public async create(campaignId: string, file: Express.Multer.File, description: string) {
    // try{

    //   const { url, public_id } = await this.uploadToCloudinary(file);
      
    //   const newCampaignImage = await this.prisma.campaignImage.create({
    //     data: {
    //       description,
    //       imageUrl: url,
    //       campaignId,
    //     },
    //   });
    //   return newCampaignImage;
    // }catch (error) {
    //   console.error('Error creando imagen de campaña:', error);
    // }
  }

  /*
  findAll() {
    return `This action returns all campaignImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campaignImage`;
  }

  update(id: number, updateCampaignImageDto: UpdateCampaignImageDto) {
    return `This action updates a #${id} campaignImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaignImage`;
  }*/

    public async uploadCampaignImage(campaignId: string, file: Express.Multer.File, description?: string) {
      if (!file) throw new Error('No file provided');

      if (!isUUID(campaignId)) {
        throw new BadRequestException(`Invalid UUID format for id: ${campaignId}`);
      }
      try {
        // Verificar que exista
        const campaign = await this.prisma.campaign.findUnique({
          where: { id: campaignId },
        });

        if (!campaign) {
          throw new NotFoundException(`Campaign with id ${campaignId} not found`);
        }
        // const newID = uuidv4();
        const result = await this.cloudinaryService.uploadImage(file);
        const newCampaignImage = await this.prisma.campaignImage.create({
          data: {
            description: description,
            image_Url: result.url,
            public_id: result.public_id,
            campaignId: campaignId,
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

    public async getImagesByCampaign(campaignId: string) {
      try{
        if (!isUUID(campaignId)) {
          throw new BadRequestException(`Invalid UUID format for id: ${campaignId}`);
        }
        return await this.prisma.campaignImage.findMany({
          where: { campaignId: campaignId },
          select: {
            id: true,
            description: true,
            image_Url: true,
          },
        });
      }
      catch (error) {
        console.error('Error fetching campaign images:', error);
        throw error;
      }
    
    }

    public async deleteImage(imageId: string) {
      try {
        if (!isUUID(imageId)) {
          throw new BadRequestException(`Invalid UUID format for id: ${imageId}`);
        }
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
}
