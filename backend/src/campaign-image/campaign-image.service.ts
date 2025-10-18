import { Injectable } from '@nestjs/common';
import { CreateCampaignImageDto } from './dto/create-campaign-image.dto';
import { UpdateCampaignImageDto } from './dto/update-campaign-image.dto';
import { cloudinary } from 'src/cloudinary/cloudinary.provider';
import * as streamifier from 'streamifier';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignImageService {
  constructor(private prisma: PrismaService) { }

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
}
