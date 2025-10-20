import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  
  // listas todos los donations
  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  // Cancelar/eliminar donación
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.donationsService.remove(id);
  }

    // Actualizar status de la donación
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDonationStatusDto: UpdateDonationDto,
  ) {
    return this.donationsService.updateStatus(id, updateDonationStatusDto);
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
    */
}
