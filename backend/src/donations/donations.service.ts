import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Decimal } from 'generated/prisma/runtime/library';

@Injectable()
export class DonationsService {

  constructor(private prisma: PrismaService) { }

  public async create(createDonationDto: CreateDonationDto) {
    try {
      const foundation = await this.prisma.foundation.findUnique({
        where: { id: createDonationDto.foundationId },
      });
      if (!foundation) throw new BadRequestException('Foundation not found');

      const user = await this.prisma.user.findUnique({
        where: { id: createDonationDto.userId },
      });
      if (!user) throw new BadRequestException('User not found');
      const newID = uuidv4();
      return await this.prisma.donation.create({
        data: {
          id: newID,
          amount: new Decimal(createDonationDto.amount),
          isAnonymous: createDonationDto.isAnonymous ?? false,
          donorName: createDonationDto.donorName,
          donorEmail: createDonationDto.donorEmail,
          paymentMethod: createDonationDto.paymentMethod,
          transactionCode: createDonationDto.transactionCode,
          userId: createDonationDto.userId,
          foundationId: createDonationDto.foundationId,
        },
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error; // re-lanza la excepción para que NestJS la maneje
    }
  }

  //listar todas las donaciones
  public async findAll() {
    try {
      return await this.prisma.donation.findMany({
        include: { user: true, foundation: true },

      });
    }catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  }



  
  findOne(id: number) {
    return `This action returns a #${id} donation`;
  }

  public async updateStatus(id: string, updateDonationDto: UpdateDonationDto) {
     try {
      const donation = await this.prisma.donation.findUnique({ where: { id } });
      if (!donation) throw new NotFoundException(`Donation with id ${id} not found`);

      const updated = await this.prisma.donation.update({
        where: { id },
        data: { status: updateDonationDto.status },
      });

      return updated;
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  }

  

  public async remove(id: string) {
     try {
      const donation = await this.prisma.donation.findUnique({ where: { id } });
      if (!donation) throw new NotFoundException(`Donation with id ${id} not found`);

      //  delete real o solo marcar como CANCELLED
      const deleted = await this.prisma.donation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      return { message: 'Donation cancelled', donation: deleted };
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  }
}
