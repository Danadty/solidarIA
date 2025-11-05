import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/user.types';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Public()
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

  // listar donaciones de un usuario específico
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.FOUNDATION)
  // @Get('user/:userId')
  // findByUser(@Param('userId') userId: string) {
  //   return this.donationsService.findByUser(userId);
  // }
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.USER)
  // @Get('me') // endpoint para el usuario autenticado
  // async findMyDonations(@Req() req: any) {
  //   const userId = req.user.id; // asumimos que el AuthGuard inyecta el usuario
  //   return this.donationsService.findByUser(userId);
  // }
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('my-donations')
  async findMyDonations(@Req() req) {
    const { id, role } = req.user; // viene del token
    return this.donationsService.findByRole(id, role);
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
