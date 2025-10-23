import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/user.types';
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }


  // listas todos los donations
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  // Cancelar/eliminar donación
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.donationsService.remove(id);
  }

  // Actualizar status de la donación
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDonationStatusDto: UpdateDonationDto,
  ) {
    return this.donationsService.updateStatus(id, updateDonationStatusDto);
  }

  // Listar donaciones de un usuario específico
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get donations by user ID' })
  @ApiResponse({ status: 200, description: 'List of donations for the specified user' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format for userId' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string) {
    return this.donationsService.findByUser(userId);
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
