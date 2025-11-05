import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCampaignDto } from './dto/create-user-campaign.dto';
import { UpdateUserCampaignDto } from './dto/update-user-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as generateUUID } from 'uuid';
import { isUUID } from 'class-validator';


@Injectable()
export class UserCampaignService {
  constructor(private prisma: PrismaService) { }

  public async create(createUserCampaignDto: CreateUserCampaignDto) {
    try {
      const { userId, campaignId } = createUserCampaignDto;
      // Validar que exista el usuario y la campaña
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      //Validar existencia de campaña
      const campaign = await this.prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
      })
      if (!campaign) {
        throw new Error(`Campaign with id ${campaignId} not found`);
      }

      //  Evitar duplicados (por la unique constraint)
      const existingRelation = await this.prisma.userCampaign.findFirst({
        where: { userId, campaignId },
      });
      if (existingRelation) {
        throw new BadRequestException('User is already associated with this campaign');
      }
      const newID = generateUUID();

      console.log(createUserCampaignDto);
      // create user campaign
      const newUserCampaign = await this.prisma.userCampaign.create({
        data: {
          id: newID,
          userId: userId,
          campaignId: campaignId,
          joinDate: new Date(),
        },
      });

      return {
        message: 'User successfully joined the campaign',
        userCampaign: newUserCampaign,
      };
    } catch (error) {
      console.error('Error creating user campaign:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  public async findAll() {

    try {
      const relations = await this.prisma.userCampaign.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          campaign: {
            select: {
              id: true,
              title: true,
              description: true,
              start_Date: true,
              end_Date: true,
            },
          },
        },
      });

      if (relations.length === 0) {
        return { message: 'No user-campaign relations found', data: [] };
      }

      return {
        message: 'User-campaign relations retrieved successfully',
        data: relations,
      };
    } catch (error) {
      console.error('Error fetching user-campaign relations:', error);
      throw error;
    }
  }



  public async findAllByUser(userid: string) {
    try {
      if (!isUUID(userid)) {
        throw new BadRequestException('Invalid UUID format for userId');
      }
      // Verificar que el usuario exista
      const user = await this.prisma.user.findUnique({
        where: { id: userid },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userid} not found`);
      }
      // Buscar todas las relaciones del usuario con campañas
      const userCampaigns = await this.prisma.userCampaign.findMany({
        where: { userId: userid },
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
              description: true,
              start_Date: true,
              end_Date: true,
            },
          },
        },
      });
      if (userCampaigns.length === 0) {
        return {
          message: `User with id ${userid} is not associated with any campaigns.`,
          campaigns: [],
        };
      }
      return {
        message: `Campaigns for user ${user.name}`,
        campaigns: userCampaigns.map((relation) => relation.campaign),
      };

    } catch (error) {
      console.error('Error fetching user-campaign relations:', error);
      throw error;
    }
  }



  public async findByCampaign(campaignId: string) {
    try {
      if (!isUUID(campaignId)) {
        throw new BadRequestException('Invalid UUID format for campaignId');
      }
      // Verificar que la campaña exista
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
      });
      if (!campaign) {
        throw new NotFoundException(`Campaign with id ${campaignId} not found`);
      }
      // Buscar todas las relaciones de la campaña con usuarios
      const campaignUserRelations = await this.prisma.userCampaign.findMany({
        where: { campaignId: campaignId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return {
        message: `Users associated with campaign ${campaign.title}`,
        users: campaignUserRelations.map((relation) => relation.user),
      };
    } catch (error) {
      console.error('Error fetching user-campaign relations:', error);
      throw error;
    }
  }

   public async unsubscribe(userId: string, campaignId: string) {
    try {
      // Verificar si existe la relación
      const existingRelation = await this.prisma.userCampaign.findFirst({
        where: { userId, campaignId },
      });

      if (!existingRelation) {
        throw new NotFoundException(
          `No subscription found for user ${userId} in campaign ${campaignId}`,
        );
      }

      // Eliminar la relación
      await this.prisma.userCampaign.deleteMany({
        where: { userId, campaignId },
      });

      return {
        message: 'User successfully unsubscribed from the campaign',
        removedRelation: existingRelation,
      };
    } catch (error) {
      console.error('Error unsubscribing from campaign:', error);
      throw error;
    }
  }
  
  findOne(id: number) {
    return `This action returns a #${id} userCampaign`;
  }

  update(id: number, updateUserCampaignDto: UpdateUserCampaignDto) {
    return `This action updates a #${id} userCampaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCampaign`;
  }
}
function uuidv4() {
  throw new Error('Function not implemented.');
}

